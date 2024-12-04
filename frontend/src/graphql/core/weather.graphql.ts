import { gql } from "@apollo/client/core";

export const WeatherQuery = gql`
  query Weather {
    weather {
      temp
      feels_like
      temp_min
      temp_max
      pressure
      humidity
      wind_speed
      wind_deg
      clouds
      visibility
      error
      cached
      icon
      main
      location
    }
  }
`;
