'use client';

import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import '@styles/defaultLayout.scss';
import Link from 'next/link';

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box className="drawer-content">
      <Box className="drawer-close-btn">
        <IconButton
          sx={{ display: { md: 'none' } }}
          onClick={handleDrawerToggle}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Link href={'/dashboard'} className="link">
        <Typography variant="h6">대시보드</Typography>
      </Link>
      <Link href={'/list'} className="link">
        <Typography variant="h6">히스토리</Typography>
      </Link>
    </Box>
  );

  return (
    <Box className="layout-container">
      <CssBaseline />

      {/* 헤더 */}
      <AppBar position="fixed" className="header">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            가계부 앱
          </Typography>
        </Toolbar>
      </AppBar>

      <Box className="content-wrapper">
        {/* 사이드바 */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          className="mobile-drawer"
        >
          {drawer}
        </Drawer>
        <Drawer variant="permanent" className="desktop-drawer" open>
          {drawer}
        </Drawer>

        {/* 메인 콘텐츠 */}
        <Box component="main" className="main-content">
          {children}
        </Box>
      </Box>

      {/* 푸터 */}
      <Box component="footer" className="footer">
        <Typography variant="body2">© 2025 가계부 앱</Typography>
      </Box>
    </Box>
  );
}
