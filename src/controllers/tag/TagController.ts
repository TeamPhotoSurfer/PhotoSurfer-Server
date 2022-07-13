import { Request, Response } from "express";
import statusCode from "../../modules/statusCode";
import message from "../../modules/responseMessage";
import util from "../../modules/util";
import { validationResult } from "express-validator";
import TagService from "../../services/tag/TagService";
import { TagResponseDTO } from "../../interfaces/tag/TagResponseDTO";
import { TagNameUpdateDTO } from "../../interfaces/tag/TagNameUpdateDTO";
import { Long } from "typeorm";

/**
 * @route GET /tag
 * @Desc READ tag name
 * @Access public
 */
const getTagName = async (req: Request, res: Response) => {
  const error = validationResult(req);
  const tagResponseDTO: TagResponseDTO = req.body;
  if (!error.isEmpty()) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(util.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
  }
  try {
    const data = await TagService.getTagName(tagResponseDTO);

    if (!data) {
      return res
        .status(statusCode.NOT_FOUND)
        .send(util.fail(statusCode.NOT_FOUND, message.NOT_FOUND));
    }

    res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.READ_TAG_NAME_SUCCESS, data));
  } catch (error) {
    console.log(error);
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(
        util.fail(
          statusCode.INTERNAL_SERVER_ERROR,
          message.INTERNAL_SERVER_ERROR
        )
      );
  }
};

/**
 * @route PUT /tag/:tagId
 * @desc update tag name
 * @access Public
 */

const updateTagName = async (req: Request, res: Response) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(util.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
  }

  const tagId: Long = req.params;
  const tagNameUpdateDTO: TagNameUpdateDTO = req.body;

  try {
    const data = await TagService.updateTagName(
      tagId,
      tagNameUpdateDTO,
      req.body.user.id
    );
    if (!data)
      return res
        .status(statusCode.NOT_FOUND)
        .send(util.fail(statusCode.NOT_FOUND, message.NOT_FOUND));

    res.status(statusCode.NO_CONTENT).send();
  } catch (error) {
    console.log(error);
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(
        util.fail(
          statusCode.INTERNAL_SERVER_ERROR,
          message.INTERNAL_SERVER_ERROR
        )
      );
  }
};

export default {
  getTagName,
  updateTagName,
};
