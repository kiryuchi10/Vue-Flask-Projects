import React from "react";
import { Box, Grid, Typography } from "@mui/material";

function RecentViews({ recentItems }) {
  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        {recentItems.map((item, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 2,
                border: "1px solid #ddd",
                borderRadius: "8px",
                backgroundColor: "#f9f9f9",
              }}
            >
              <img
                src={item.image}
                alt={item.alt}
                style={{ width: "100%", borderRadius: "8px" }}
              />
              <Typography variant="h6" sx={{ mt: 2 }}>
                {item.title}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default RecentViews;
