import { IncomingMessage } from "http";
import { v4 } from "uuid";
import { CustomContext, TaggedContext } from "../types/sharedTypes";
import { Errors, generateErrorObject } from "./Logger";
import { HortusProvider, HortusError } from "../services/hortus";
import { LocalAuthProvider } from "../services/LocalAuthProvider";
import { UserModel } from "../models/User";

interface ApolloRequest extends IncomingMessage {
  body?: any;
}

const queriesThatDontRequireAuthentication = [
  "authenticate",
  "introspectionquery",
  "initforgotpassword",
  "finishforgotpassword",
  "getspecificblogentry",
  "newticket",
  "newnewsletterentry",
  "getrecententries",
  "getmostviewedentries",
  "getallentriesids",
  "updateblogmetrics",
  "newuserdetailsentry",
	"getmetric",
];

const getQueryName = (body: any): string => {
  let { query: unparsedQuery } = body;
  unparsedQuery = unparsedQuery.trim();
  const type = unparsedQuery.split(" ")[0];

  switch (type) {
    case "mutation": {
      const queryWithoutType = unparsedQuery.substring(9);
      const toReturn = queryWithoutType.substring(
        0,
        queryWithoutType.indexOf("(")
      );
      return toReturn.trim();
    }
    case "query": {
      const queryWithoutType = unparsedQuery.substring(6).split("\n")[0];
      let toReturn;
      const parenthesis = queryWithoutType.indexOf("(");
      const curlyBrace = queryWithoutType.indexOf("{");

      if (parenthesis > 0 && parenthesis < curlyBrace) {
        toReturn = queryWithoutType.substring(0, queryWithoutType.indexOf("("));
      } else {
        toReturn = queryWithoutType.substring(0, queryWithoutType.indexOf("{"));
      }

      return toReturn.trim();
    }
    default: {
      return "";
    }
  }
};

export const getCustomContext = async (
  req: ApolloRequest,
  gridFs: any
): Promise<CustomContext | TaggedContext> => {
  const token = req.headers?.["authorization"] || "";
  const tokenWithoutBearer = token.replace("Bearer", "").trim();
  const query = req.body?.operationName || getQueryName(req.body);
  const taggedContext = initContextTagging(query, gridFs);

  if (queriesThatDontRequireAuthentication.includes(query.toLowerCase()))
    return taggedContext;

  if (!token || tokenWithoutBearer === "")
    throw new Error("A verification token is required.");

  try {
    const result = await HortusProvider.verify(tokenWithoutBearer);

    const User = await UserModel.findOne({ email: result.user.email });
    if (!User) {
      throw await generateErrorObject(
        Errors.UNKOWN_USER,
        `User ${result.user.email} not found locally. Sync required.`,
        taggedContext
      );
    }

    return {
      User,
      ...taggedContext,
    };
  } catch (err) {
    if (err instanceof HortusError && err.isNetworkError) {
      try {
        const User = LocalAuthProvider.verify(tokenWithoutBearer);
        return { User, ...taggedContext };
      } catch (jwtErr) {
        let error = jwtErr as Error;
        if (error.message === "jwt expired") {
          error = "Session expired." as any;
        }
        throw await generateErrorObject(
          Errors.INTERNAL_SERVER_ERROR,
          String(error),
          taggedContext
        );
      }
    }

    throw await generateErrorObject(
      Errors.INTERNAL_SERVER_ERROR,
      err instanceof Error ? err.message : String(err),
      taggedContext
    );
  }
};

const initContextTagging = (query: string, gridFs: any): TaggedContext => {
  const requestId = v4();

  return {
    requestId,
    query,
    gridFs,
  };
};
