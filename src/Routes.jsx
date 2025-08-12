import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import Dashboard from './pages/dashboard';
import ExportCenter from './pages/export-center';
import FacturesManagement from './pages/factures-management';
import NetworkVisualization3D from './pages/3d-network-visualization';
import AIDocumentProcessingPlayground from './pages/ai-document-processing-playground';
import KimbialeMangement from './pages/kimbiales-management';
import POSManagement from './pages/pos-management';
import ChequesManagement from './pages/cheques-management';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/export-center" element={<ExportCenter />} />
        <Route path="/factures-management" element={<FacturesManagement />} />
        <Route path="/3d-network-visualization" element={<NetworkVisualization3D />} />
        <Route path="/ai-document-processing-playground" element={<AIDocumentProcessingPlayground />} />
        <Route path="/kimbiales-management" element={<KimbialeMangement />} />
        <Route path="/pos-management" element={<POSManagement />} />
        <Route path="/cheques-management" element={<ChequesManagement />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;