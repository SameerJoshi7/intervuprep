import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import TopicPage from "./pages/TopicPage";
import QuestionPage from "./pages/QuestionPage";
import ConceptPage from "./pages/ConceptPage";
import VisualizePage from "./pages/VisualizePage";
import QuizPage from "./pages/QuizPage";
import ReviewPage from "./pages/ReviewPage";
import StatsPage from "./pages/StatsPage";
import AccountPage from "./pages/AccountPage";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/topic/:slug" element={<TopicPage />} />
        <Route path="/question/:id" element={<QuestionPage />} />
        <Route path="/concept/:id" element={<ConceptPage />} />
        <Route path="/visualize" element={<VisualizePage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
