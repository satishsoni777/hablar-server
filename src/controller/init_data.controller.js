import { InitData } from "../service/init_data/init_data.js";
import { BaseController } from "../webserver/base_controller.js";

const baseController = new BaseController();

const getInitData = (req, res) => {
    InitData.getInitData("", (err, result) => {
        if (err) {
            return baseController.errorMessage(err, res,);
        }
        else {
            return baseController.successResponse(result, res,);
        }
    })
}

export const InitDataController = { getInitData }