"use client";

import { AppBar, Box, CssBaseline, Drawer, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";

const drawerWidth = 240;

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: drawerWidth, p: 2 }}>
      <Typography variant="h6">대시보드</Typography>
      <Typography variant="h6">히스토리</Typography>
      {/* 사이드 메뉴 항목 추가 가능 */}
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <CssBaseline />
      
      {/* 헤더 */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 2 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            가계부 앱
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Box sx={{ display: "flex", flex: 1, mt: 8 }}>
        {/* 사이드바 */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth, mt: "64px" },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            flexShrink: 0,
            "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box", mt: "64px" },
          }}
          open
        >
          {drawer}
        </Drawer>
        
        {/* 메인 콘텐츠 */}
        <Box component="main" sx={{ flexGrow: 1, p: 3, ml: { sm: `${drawerWidth}px` }, overflow: "auto" }}>
          {children}
        </Box>
      </Box>
      
      {/* 푸터 */}
      <Box component="footer" sx={{ p: 2, textAlign: "center", bgcolor: "grey.200", position: "fixed", bottom: 0, width: "100%" }}>
        <Typography variant="body2">© 2025 가계부 앱</Typography>
      </Box>
    </Box>
  );
}
