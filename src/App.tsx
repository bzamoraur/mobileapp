import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { Home } from '@/pages/Home';
import { Days } from '@/pages/Days';
import { DayDetail } from '@/pages/DayDetail';
import { MapPage } from '@/pages/MapPage';
import { Phrases } from '@/pages/Phrases';
import { Help } from '@/pages/Help';
import { Flights } from '@/pages/Flights';
import { Insurance } from '@/pages/Insurance';
import { Accommodations } from '@/pages/Accommodations';
import { NotFound } from '@/pages/NotFound';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Home />} />
          <Route path="dias" element={<Days />} />
          <Route path="dias/:index" element={<DayDetail />} />
          <Route path="mapa" element={<MapPage />} />
          <Route path="frases" element={<Phrases />} />
          <Route path="ayuda" element={<Help />} />
          <Route path="vuelos" element={<Flights />} />
          <Route path="seguro" element={<Insurance />} />
          <Route path="alojamientos" element={<Accommodations />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
