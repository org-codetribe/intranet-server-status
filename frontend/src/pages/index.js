"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { statusService } from "../../services/statusService";

export default function StatusPage() {
  const [frontend, setFrontend] = useState("unknown");
  const [backend, setBackend] = useState("unknown");
  const [database, setDatabase] = useState("unknown");
  const [logs, setLogs] = useState([]);
  const [lastChecked, setLastChecked] = useState();
  const [isLoading, setisLoading] = useState(true);
  const loadData = async () => {
    try {
      setisLoading(true);
      const stored = localStorage.getItem("lastChecked");
      if (stored) {
        setLastChecked(new Date(stored));
      }
      const response = await statusService.checkStatus();
      console.log("response", response);

      setFrontend(response.frontend === "UP" ? "up" : "down");
      setBackend(response.backend === "UP" ? "up" : "down");
      setDatabase(response.mongo === "UP" ? "up" : "down");

      const logsResp = await statusService.getLogs();
      setLogs(logsResp);
      localStorage.setItem("lastChecked", new Date().toISOString());
    } catch (err) {
      console.error("Error loading system status:", err);
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // const interval = setInterval(loadData, 10000);
    // return () => clearInterval(interval);
  }, []);

  const renderStatusCard = (title, subtitle, status) => {
    const isUp = status === "up";

    return (
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: 3,
          textAlign: "center",
          p: 2,
        }}
      >
        <CardContent>
          {isLoading ? (
            <CircularProgress size={40} color="primary" />
          ) : isUp ? (
            <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
          ) : (
            <CancelIcon color="error" sx={{ fontSize: 40 }} />
          )}

          <Typography variant="h6" sx={{ mt: 1 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>

          <Chip
            label={isLoading ? "Checking..." : isUp ? "Operational" : "Down"}
            color={isLoading ? "warning" : isUp ? "success" : "error"}
            sx={{ mt: 2, fontWeight: "bold" }}
          />
        </CardContent>
      </Card>
    );
  };
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        System Status
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        gutterBottom
      >
        Last checked:{" "}
        {lastChecked
          ? lastChecked.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
          : "Loading..."}
      </Typography>

      <Grid container spacing={3} justifyContent="center" sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          {renderStatusCard("Admin Panel", "Web client availability", frontend)}
        </Grid>
        {/* <Grid item xs={12} sm={6} md={3}>
          {renderStatusCard(
            "Application Backend",
            "Application API and server status",
            backend
          )}
        </Grid> */}
        <Grid item xs={12} sm={6} md={3}>
          {renderStatusCard(
            "Backend",
            "Admin Panel API and server status",
            backend
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {renderStatusCard("Database", "Database connectivity", database)}
        </Grid>
      </Grid>

      <Box textAlign="center" sx={{ mt: 3 }}>
        <Button variant="contained" color="primary" onClick={loadData}>
          Refresh Now
        </Button>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" gutterBottom>
          Timestamp Logs
        </Typography>
        <Box
          component="table"
          sx={{ width: "100%", borderCollapse: "collapse" }}
        >
          <Box component="thead">
            <Box component="tr" sx={{ backgroundColor: "#f5f5f5" }}>
              <Box
                component="th"
                sx={{ p: 1, border: "1px solid #ddd", textAlign: "center" }}
              >
                Service
              </Box>
              <Box
                component="th"
                sx={{ p: 1, border: "1px solid #ddd", textAlign: "center" }}
              >
                Status
              </Box>
              <Box
                component="th"
                sx={{ p: 1, border: "1px solid #ddd", textAlign: "center" }}
              >
                Timestamp
              </Box>
            </Box>
          </Box>
          <Box component="tbody">
            {logs.map((log, i) => (
              <Box component="tr" key={i}>
                <Box
                  component="td"
                  sx={{ p: 1, border: "1px solid #ddd", textAlign: "center" }}
                >
                  {log.service}
                </Box>
                <Box
                  component="td"
                  sx={{ p: 1, border: "1px solid #ddd", textAlign: "center" }}
                >
                  {log.status}
                </Box>
                <Box
                  component="td"
                  sx={{ p: 1, border: "1px solid #ddd", textAlign: "center" }}
                >
                  {new Date(log.checkedAt).toLocaleString()}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
