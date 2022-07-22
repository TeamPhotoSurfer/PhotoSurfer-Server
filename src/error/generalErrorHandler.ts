import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import config from "../config/index";
import slackAlarm, { SlackMessageFormat } from "../middleware/slackAlarm";
import messages from "../modules/responseMessage";
import util from "../modules/util";
import { ErrorWithStatusCode } from "./errorGenerator";

const generalErrorHandler: ErrorRequestHandler = (
  err: ErrorWithStatusCode,
  req: Request,
  res: Response,
  next: NextFunction
): void | Response => {
  const { message, statusCode } = err;

  // 인자로 statusCode를 넘기지 않는 경우, 500 에러를 보냄
  if (!statusCode || statusCode == 500) {
    const message: SlackMessageFormat = {
        color: slackAlarm.colors.danger,
        title: "포토서퍼 서버 에러",
        text: err.message,
        fields: [
          {
            title: "Error Stack:",
            value: `\`\`\`${err.stack}\`\`\``,
          },
        ],
      };
      slackAlarm.sendMessage(message);
    
    return res.status(500).send(util.fail(500, messages.INTERNAL_SERVER_ERROR));
  } else {
    return res.status(statusCode).send(util.fail(statusCode, message));
  }
};

export default generalErrorHandler;
