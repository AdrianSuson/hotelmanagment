import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import PropTypes from "prop-types";
import config from "../../../state/config";

const AdvertisementCard = ({ ad, isHovered }) => {
  return (
    <Card
      sx={{
        position: "relative",
        boxShadow: isHovered ? 6 : 3,
        transition: "transform 0.3s, box-shadow 0.3s",
        transform: isHovered ? "scale(1.05)" : "scale(1)",
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={`${config.API_URL}/advertisements/${ad.image_url}`}
        alt={ad.title}
        sx={{
          filter: isHovered ? "brightness(50%)" : "brightness(100%)",
        }}
      />
      {isHovered && (
        <CardContent
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: "white",
            padding: 2,
          }}
        >
          <Typography variant="h6">{ad.title}</Typography>
          <Typography variant="body2">{ad.description}</Typography>
        </CardContent>
      )}
    </Card>
  );
};

AdvertisementCard.propTypes = {
  ad: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image_url: PropTypes.string.isRequired,
  }).isRequired,
  isHovered: PropTypes.bool.isRequired,
};

export default AdvertisementCard;
