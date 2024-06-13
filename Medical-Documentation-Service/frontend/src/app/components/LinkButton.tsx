import { Button } from "@mui/material";
import Link from "next/link";
import { ComponentProps, ReactNode } from "react";

type LinkButtonProps = {
  linkProps: ComponentProps<typeof Link>;
  buttonProps?: ComponentProps<typeof Button>;
  children?: ReactNode;
};

export const LinkButton = ({
  buttonProps,
  linkProps,
  children,
}: LinkButtonProps) => {
  return (
    <Button variant="contained" sx={{ m: 1 }} {...buttonProps}>
      <Link {...linkProps}>{children}</Link>
    </Button>
  );
};
