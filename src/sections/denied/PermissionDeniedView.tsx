import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import { RouterLink } from "src/routes/components";
import { SimpleLayout } from "src/layouts/simple";

// ----------------------------------------------------------------------

export function PermissionDeniedView() {
  return (
    <SimpleLayout content={{ compact: true }}>
      <Container>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Access Denied (403)
        </Typography>

        <Typography sx={{ color: "text.secondary" }}>
          You don’t have permission to access this page. If you believe this is an error, please contact your administrator.
        </Typography>

        <Box
          component="img"
          src="/assets/illustrations/illustration-403.svg"
          sx={{
            width: 320,
            height: "auto",
            my: { xs: 5, sm: 10 },
          }}
        />

        <Button component={RouterLink} href="/" size="large" variant="contained" color="inherit">
          Go to Home
        </Button>
      </Container>
    </SimpleLayout>
  );
}
