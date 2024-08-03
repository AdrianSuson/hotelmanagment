import PropTypes from "prop-types";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  useTheme,
  Box,
} from "@mui/material";
import config from "../../../../globalState/config";

const RoomCard = ({ room }) => {
  const theme = useTheme();

  const imageUrl = room.imageUrl
    ? `${config.API_URL}${room.imageUrl}`
    : "/assets/default-image.jpg";

  return (
    <Card
      sx={{
        maxWidth: 345,
        position: "relative",
        mb: 3,
        boxShadow: theme.shadows[3],
        borderRadius: theme.shape.borderRadius,
        transition: "transform 0.3s",
        "&:hover": {
          boxShadow: theme.shadows[10],
          transform: "scale(1.05)",
          "& .MuiCardContent-root": {
            opacity: 1,
          },
        },
      }}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="250"
          image={imageUrl}
          alt={`Room ${room.roomNumber}`}
          sx={{
            borderTopLeftRadius: theme.shape.borderRadius,
            borderTopRightRadius: theme.shape.borderRadius,
          }}
        />
        <CardContent
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            color: theme.palette.common.white,
            padding: theme.spacing(2),
            opacity: 0,
            transition: "opacity 0.3s",
          }}
        >
          <Typography gutterBottom variant="h5" component="div">
            Room {room.roomNumber}
          </Typography>
          <Typography variant="body2" color="inherit" sx={{ mb: 1 }}>
            Type: {room.type}
          </Typography>
          <Typography variant="body2" color="inherit" sx={{ mb: 1 }}>
            Price: ${room.price}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
};

RoomCard.propTypes = {
  room: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    imageUrl: PropTypes.string.isRequired,
    roomNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
  }).isRequired,
};

export default RoomCard;
