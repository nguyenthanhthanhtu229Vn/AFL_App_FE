import React, { useState,useEffect } from "react";
import "./styles/style.css";

import {getTeamInMatchByTourId} from "../../api/TeamInMatchAPI"

import KnockOutStageSchedule from "./KnockOutStageSchedule";
import CricleStageSchedule from "./CricleStageSchedule";


function ScheduleTournamentDetail(props) {
  const {tourDetailId,tournamentType,hostTournamentId} = props;
  const [loading,setLoading] = useState(false);
  const [active, setactive] = useState(true);
  const [allTeam,setAllTeam] = useState(null);

  useEffect(() => {
    getAllTeamInMatch();
  },[tourDetailId])
  const getAllTeamInMatch = () => {
    setLoading(true);
    const response = getTeamInMatchByTourId(tourDetailId);
    response.then(res =>{
      if(res.status === 200){
        console.log(res.data.teamsInMatch)
        setAllTeam(res.data.teamsInMatch)
        setLoading(false);
      }
    }).catch(err => {
      console.error(err)
      setLoading(false);
    })
      
  
  }
  return (
    <>
      <div className="teamdetail__content schedule__tour">
        <div className="wrap__title">
          <h2 className="title">Lịch thi đấu</h2>
          <div className="option__view">
            <p
              className={active ? "active" : ""}
              onClick={() => {
                setactive(true);
              }}
            >
              Danh sách
            </p>
            {tournamentType !== "CircleStage" ? <p
              className={!active ? "active" : ""}
              onClick={() => {
                setactive(false);
              }}
            >
              Biểu đồ
            </p> : null }
            
          </div>
        </div>
        {active ? (
          <div className="wrap__table">
            {
              tournamentType === "KnockoutStage" ? <KnockOutStageSchedule hostTournamentId={hostTournamentId} typeView="result" allTeam={allTeam}  /> : tournamentType === "CircleStage" ? <CricleStageSchedule hostTournamentId={hostTournamentId} loading={loading} allTeam={allTeam}  /> : null
            }
            
          </div>
        ) : (
          <KnockOutStageSchedule allTeam={allTeam} typeView="diagram"  />
        )}
      </div>
    </>
  );
}

export default ScheduleTournamentDetail;
