import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Avatar,
  Box,
  Grid,
} from "@mui/material";

const AboutUsDialog = ({ open, onClose }) => {
  const developers = [
    {
      name: "Abdurasad, Allen S.",
      picture: "../../../assets/default-image.jpg",
    },
    {
      name: "Moh. Hashim, Rana",
      picture: "../../../assets/default-image.jpg",
    },
    {
      name: "Peñaflor, Angel ",
      picture: "../../../assets/default-image.jpg",
    },
    {
      name: "Suson, Adrian D.R",
      picture: "../../../assets/photo_2024-07-20_21-35-15.jpg",
    },
  ];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>About Us</DialogTitle>
      <DialogContent dividers>
        <Typography variant="h4" component="h1" gutterBottom>
          The Iterative Model
        </Typography>
        <Typography variant="body1" paragraph>
          The iterative model is a project management and development approach
          used primarily in software development. This methodology focuses on
          creating initial, simplified versions of a product and then repeatedly
          refining and enhancing it through multiple cycles or iterations.
        </Typography>
        <Typography variant="body1" paragraph>
          Here’s a comprehensive explanation:
        </Typography>

        <Typography variant="h5" component="h2" gutterBottom>
          Key Concepts of the Iterative Model:
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Iteration:</strong> Each iteration is a mini-project,
          involving a complete cycle of planning, design, development, testing,
          and evaluation. The output of each iteration is a working product
          increment that is a part of the final product.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Incremental Development:</strong> With each iteration, the
          product is developed incrementally. This means that each cycle adds
          more features and functionalities until the final product is complete.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Feedback and Refinement:</strong> After each iteration,
          feedback is gathered from users or stakeholders. This feedback is used
          to refine the requirements and improve the product in the next
          iteration.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Risk Management:</strong> By developing the product in small
          increments, the iterative model helps in identifying and managing
          risks early in the process. Issues can be detected and resolved in the
          early stages, reducing the cost and impact of changes.
        </Typography>

        <Typography variant="h5" component="h2" gutterBottom>
          Steps in the Iterative Model:
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Initial Planning:</strong> Identify the scope and objectives
          of the project. Define the requirements and functionalities for the
          first iteration.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Design:</strong> Create a design for the iteration based on
          the requirements. This can be a simple mock-up or a more detailed
          design, depending on the project’s complexity.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Implementation:</strong> Develop the features and
          functionalities planned for this iteration. Code, build, and integrate
          the components as per the design.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Testing:</strong> Test the developed product increment for
          functionality, performance, and quality. Identify and fix any bugs or
          issues.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Evaluation:</strong> Review the iteration’s outcome with
          stakeholders and users. Gather feedback to understand what works well
          and what needs improvement.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Next Iteration Planning:</strong> Based on feedback and
          evaluation, plan the next iteration. Update the requirements and
          design for the next cycle.
        </Typography>

        <Typography variant="h5" component="h2" gutterBottom mt={4}>
          Meet the Team
        </Typography>
        <Grid container spacing={2}>
          {developers.map((developer) => (
            <Grid item xs={12} sm={6} md={3} key={developer.name}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                p={2}
                border={1}
                borderRadius={2}
              >
                <Avatar
                  src={developer.picture}
                  alt={developer.name}
                  sx={{ width: 80, height: 80, mb: 1 }}
                />
                <Typography variant="body1" align="center">
                  {developer.name}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Typography variant="body2" color="textSecondary" align="center" mt={4}>
          System Version: 1.10
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AboutUsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AboutUsDialog;
