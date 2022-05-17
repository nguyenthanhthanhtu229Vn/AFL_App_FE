import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./components/HomePageComponent/HomePage";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import MyTournaments from "./components/FindTournamentComponent/MyTournament";
import MyTeam from "./components/FindTeamComponent/MyTeam";
import CreateTeam from "./components/CreateTeamComponent/CreateTeam";
import CreateTournament from "./components/CreateTournament/CreateTournament";
import HeaderTournamentDetail from "./components/TournamentDetailComponent/HeaderTournamentDetail";
import HeaderTeamDetail from "./components/TeamDetailComponent/HeaderTeamDetail";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import useAuthListener from "./hooks/user_auth";
import Profile from "./components/ProfileComponent/Profile";
import MyListTournamentComponent from "./components/MyListTournamentComponent/MyListTournamentComponent";
function App() {
  // get Locoal Storage
  const { user } = useAuthListener();

  return (
    <div>
      <BrowserRouter>
        {/* <ScrollToTop /> */}
        <ToastContainer />
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/home" element={<HomePage />} />
          <Route
            exact
            path="/login"
            element={user ? <Navigate to={"/home"} /> : <Login />}
          />
          <Route
            exact
            path="/signup"
            element={user ? <Navigate to={"/home"} /> : <Signup />}
          />
          <Route exact path="/findTournaments" element={<MyTournaments />} />
          <Route exact path="/findTeam" element={<MyTeam />} />
          <Route
            exact
            path="/createTeam"
            element={user ? <CreateTeam /> : <Navigate to={"/login"} />}
          />
          <Route
            exact
            path="/createTournament"
            element={user ? <CreateTournament /> : <Navigate to={"/login"} />}
          />
          <Route
            exact
            path="/teamDetail/:idTeam/inforTeamDetail"
            element={<HeaderTeamDetail />}
          />
          <Route
            exact
            path="/teamDetail/:idTeam/listPlayer"
            element={<HeaderTeamDetail />}
          />

          <Route
            exact
            path="/teamDetail/:idTeam/reportTeamDeatail"
            element={<HeaderTeamDetail />}
          />
          <Route
            exact
            path="/teamDetail/:idTeam/commentTeamDetail"
            element={<HeaderTeamDetail />}
          />
          <Route
            exact
            path="/tournamentDetail/:idTour/inforTournamentDetail"
            element={<HeaderTournamentDetail />}
          />
          <Route
            exact
            path="/tournamentDetail/:idTour/commentTournamentDetail"
            element={<HeaderTournamentDetail />}
          />
          <Route
            exact
            path="/tournamentDetail/:idTour/galleryTournamentDetail"
            element={<HeaderTournamentDetail />}
          />
          <Route
            exact
            path="/tournamentDetail/:idTour/predictionTournamentDetail"
            element={<HeaderTournamentDetail />}
          />
          <Route
            exact
            path="/tournamentDetail/:idTour/rankTableTournamentDetail"
            element={<HeaderTournamentDetail />}
          />
          <Route
            exact
            path="/tournamentDetail/:idTour/scheduleTournamentDetail"
            element={<HeaderTournamentDetail />}
          />
          <Route
            exact
            path="/tournamentDetail/:idTour/teamInTournament"
            element={<HeaderTournamentDetail />}
            ignoreScrollBehavior={true}
          />
          <Route
            exact
            path="/profile"
            element={user ? <Profile /> : <Navigate to={"/login"} />}
          />
          <Route
            exact
            path="/myListTournament"
            element={
              user ? <MyListTournamentComponent /> : <Navigate to={"/login"} />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
