import { Request, Response } from "express";
import { CustomerService } from "../../services/customer-service";
import { ResUtil } from "../../helper/response.helper";
import logger from "../../util/logger";
import { getRepository } from "../../data-source";
import { Cart } from "../../entities/cart";

export const registerCustomer = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, name, email, password } = req.body;
    const customer = await CustomerService.register(
      phoneNumber,
      name,
      email,
      password
    );
    return ResUtil.success({
      res,
      message: "Customer registered successfully",
      data: customer,
    });
  } catch (error) {
    logger.error(`Error registering customer: ${error}`);
    return ResUtil.internalError({
      res,
      message: "Error registering customer",
      data: error,
    });
  }
};

export const loginCustomer = async (req: any, res: Response) => {
  try {
    const { phoneNumber, password } = req.body;
    const { customer, token } = await CustomerService.login(
      phoneNumber,
      "123456"
    );
    const sessionId = req.headers["sessionid"];
    // Update cart items with the new customer ID
    const cartRepository = getRepository(Cart);
    let cart = await cartRepository.findOne({ where: { sessionId } });
    console.log("sessionId", sessionId);
    console.log("user cart by sessionId", cart);
    console.log("customer", customer);
    if (cart) {
      cart.customerId = customer.id;
      cart.sessionId = null;
      await cartRepository.save(cart);
    }
    return ResUtil.success({
      res,
      message: "Customer logged in successfully",
      data: { customer, token },
    });
  } catch (error: any) {
    logger.error(`Error logging in customer: ${error}`);
    return ResUtil.internalError({
      res,
      message: error?.message || "Error logging in customer",
      data: error,
    });
  }
};
