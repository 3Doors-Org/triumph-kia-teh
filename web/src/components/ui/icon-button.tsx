import * as React from "react";

import { Button, type ButtonProps } from "./button";

export function IconButton(props: Omit<ButtonProps, "size">) {
  return <Button size="icon" {...props} />;
}
