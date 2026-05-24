import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import SiteLayout from './components/SiteLayout'
import Dashboard from './pages/Dashboard'
import Sites from './pages/Sites'
import GHGReports from './pages/GHGReports'
import Help from './pages/Help'
import Placeholder from './pages/Placeholder'

// Scope 1
import Scope1Stationary from './pages/site/Scope1Stationary'
import Scope1Mobile from './pages/site/Scope1Mobile'
import Scope1Fugitive from './pages/site/Scope1Fugitive'
import Scope1Summary from './pages/site/Scope1Summary'

// Scope 2
import Scope2Electricity from './pages/site/Scope2Electricity'
import Scope2HeatSteam from './pages/site/Scope2HeatSteam'
import Scope2Renewable from './pages/site/Scope2Renewable'
import Scope2Summary from './pages/site/Scope2Summary'

// Scope 3
import Scope3EmployeeCommute from './pages/site/Scope3EmployeeCommute'
import Scope3FoodConsumption from './pages/site/Scope3FoodConsumption'
import Scope3PurchasedGoods from './pages/site/Scope3PurchasedGoods'
import Scope3TDLoss from './pages/site/Scope3TDLoss'
import Scope3Upstream from './pages/site/Scope3Upstream'
import Scope3Downstream from './pages/site/Scope3Downstream'
import Scope3WasteDisposal from './pages/site/Scope3WasteDisposal'
import Scope3WaterSupply from './pages/site/Scope3WaterSupply'
import Scope3WaterTreatment from './pages/site/Scope3WaterTreatment'
import Scope3BusinessTravelAir from './pages/site/Scope3BusinessTravelAir'
import Scope3BusinessTravelSea from './pages/site/Scope3BusinessTravelSea'
import Scope3BusinessTravelLand from './pages/site/Scope3BusinessTravelLand'
import Scope3HotelStay from './pages/site/Scope3HotelStay'
import Scope3Summary from './pages/site/Scope3Summary'

// Analytics
import IntensityMetrics from './pages/site/IntensityMetrics'
import EnergyAnalytics from './pages/site/EnergyAnalytics'
import SiteReports from './pages/site/SiteReports'

function SiteRoutes() {
  return (
    <SiteLayout>
      <Routes>
        <Route path="scope1/stationary"           element={<Scope1Stationary />} />
        <Route path="scope1/mobile"               element={<Scope1Mobile />} />
        <Route path="scope1/fugitive"             element={<Scope1Fugitive />} />
        <Route path="scope1/summary"              element={<Scope1Summary />} />
        <Route path="scope2/electricity"          element={<Scope2Electricity />} />
        <Route path="scope2/heatsteam"            element={<Scope2HeatSteam />} />
        <Route path="scope2/renewable"            element={<Scope2Renewable />} />
        <Route path="scope2/summary"              element={<Scope2Summary />} />
        <Route path="scope3/employee-commute"     element={<Scope3EmployeeCommute />} />
        <Route path="scope3/food-consumption"     element={<Scope3FoodConsumption />} />
        <Route path="scope3/purchased-goods"      element={<Scope3PurchasedGoods />} />
        <Route path="scope3/td-loss"              element={<Scope3TDLoss />} />
        <Route path="scope3/upstream"             element={<Scope3Upstream />} />
        <Route path="scope3/downstream"           element={<Scope3Downstream />} />
        <Route path="scope3/waste-disposal"       element={<Scope3WasteDisposal />} />
        <Route path="scope3/water-supply"         element={<Scope3WaterSupply />} />
        <Route path="scope3/water-treatment"      element={<Scope3WaterTreatment />} />
        <Route path="scope3/business-travel-air"  element={<Scope3BusinessTravelAir />} />
        <Route path="scope3/business-travel-sea"  element={<Scope3BusinessTravelSea />} />
        <Route path="scope3/business-travel-land" element={<Scope3BusinessTravelLand />} />
        <Route path="scope3/hotel-stay"           element={<Scope3HotelStay />} />
        <Route path="scope3/summary"              element={<Scope3Summary />} />
        <Route path="intensity"                   element={<IntensityMetrics />} />
        <Route path="energy"                      element={<EnergyAnalytics />} />
        <Route path="reports"                     element={<SiteReports />} />
      </Routes>
    </SiteLayout>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/sites" element={<Layout><Sites /></Layout>} />
        <Route path="/reports" element={<Layout><GHGReports /></Layout>} />
        <Route path="/csr" element={<Layout><Placeholder title="CSR" /></Layout>} />
        <Route path="/social" element={<Layout><Placeholder title="Social" /></Layout>} />
        <Route path="/governance" element={<Layout><Placeholder title="Governance" /></Layout>} />
        <Route path="/help" element={<Layout><Help /></Layout>} />
        <Route path="/sites/:siteId/*" element={<Layout><SiteRoutes /></Layout>} />
      </Routes>
    </BrowserRouter>
  )
}
