import type { Response } from "express";

export const sucessRes = (res: Response, data: any) => {
  return res.status(200).json({ success: "ok", data: data });
};
