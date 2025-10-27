import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import API from "../utils/axios";
import { getAuthToken } from "../utils/getAuthToken";
import { decodeToken } from "../utils/decodeToken";

export default function ContestLeaderboard() {
  const [loading, setLoading] = useState(true);
  const [topScorer, setTopScorer] = useState([]);
  const [winners, setWinners] = useState([]);
  const [currentUserData, setCurrentUserData] = useState(null);

  const location = useLocation();
  const contest = location.state;
  const contestId = contest ? contest.contestId : "";

  const authToken = getAuthToken();
  const userData = decodeToken(authToken);
  const userId = userData?.id;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/contest/leaderboard/${contestId}?userId=${userId}`);

        setTopScorer(res.data.topScorer || []);
        setWinners(res.data.winners || []);
        setCurrentUserData(res.data.currentUserData || null);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        setTopScorer([]);
        setWinners([]);
        setCurrentUserData(null);
      } finally {
        setLoading(false);
      }
    };

    if (contestId) fetchLeaderboard();
  }, [contestId, userId]);

  if (!contestId) {
    return (
      <div className="page-wrapper">
        <div className="content-row">
          <main className="app-container mb-2">
            <div className="leadbord-container">
              <div className="row justify-content-center">
                <div className="col-12">
                  <div className="alert alert-warning text-center mt-5">
                    Contest not found. Please select a valid contest to view the
                    leaderboard.
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }



  return (
    <>
      <div className="page-wrapper">
        <div className="content-row">
          <main className="app-container mb-2">
            <div className="leadbord-container">
              <div className="row justify-content-center">
                <div className="col-12">
                  <div className="leaderboard-card">
                    <div className="mb-2">
                      <h4 className="mb-1 text-lg text-center">
                        {contest?.title || "Current Affairs Contest"} - Leaderboard
                      </h4>
                      <p>
                        Track your progress, celebrate your wins, and see where you
                        stand among the top learners. Stay consistent, keep learning,
                        and climb the leaderboard to earn rewards!
                      </p>
                    </div>

                    {/* Winners Section */}
                    {winners.length > 0 ? (
                      <>
                        <h5 className="mb-3 text-sm">
                          <span className="h5">🏆</span> Contest Winners{" "}
                          <span className="text-lg color-one">
                            ({winners.length < 10 ? `0${winners.length}` : winners.length})
                          </span>
                        </h5>

                        <div className="row g-2">
                          {winners.slice(0, 3).map((w, i) => (
                            <div className="col-12 col-md-4 place" key={i}>
                              <div
                                className={`winner-card mb-0 ${w.rank === 1
                                  ? "alert alert-success"
                                  : w.rank === 2
                                    ? "alert alert-warning"
                                    : "alert alert-info"
                                  }`}
                              >
                                <h6 className="mb-1 d-flex justify-content-between js">
                                  <span className="fw-semibold">
                                    {w.first_name} {w.last_name}
                                  </span>
                                  <span>
                                    {w.rank === 1
                                      ? `${w.rank}st 🥇`
                                      : w.rank === 2
                                        ? `${w.rank}nd 🥈`
                                        : `${w.rank}rd 🥉`}
                                  </span>
                                </h6>
                                <div className="small-muted d-flex justify-content-between py-1">
                                  <span className="text-sm">Score: {w.score.toFixed(4)}</span>
                                  <span className="fw-bold text-xxsm">Win : {w.prizeAmount}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Leaderboard Table */}
                        <div className="table-responsive">
                          <table className="mt-3 rank-table text-xxsm">
                            <thead className="text-xxsm">
                              <tr className="small-muted">
                                <th style={{ maxWidth: '30px' }}>Rank</th>
                                <th>Name</th>
                                <th style={{ maxWidth: '30px' }}>Accuracy</th>
                                <th style={{ maxWidth: '100px' }}>Score</th>
                                <th style={{ maxWidth: '30px' }}>Win</th>
                              </tr>
                            </thead>
                            <tbody>
                              {/* Sticky Current User */}
                              {currentUserData && (
                                <tr className="sticky-row">
                                  <td>{currentUserData.rank}</td>
                                  <td>{"You"}</td>
                                  <td>
                                    {(
                                      (currentUserData.score /
                                        (currentUserData.correct +
                                          currentUserData.wrong +
                                          currentUserData.skipped)) *
                                      100
                                    ).toFixed(2)}
                                    %
                                  </td>
                                  <td>
                                    {(currentUserData.score).toFixed(3)}
                                  </td>
                                  <td className="fw-bold color-one text-success">Win {" "}
                                    {
                                      winners.find((w) => w.userId === currentUserData.userId)?.prizeAmount || "-"
                                    }
                                  </td>

                                </tr>
                              )}

                              {/* Other Users */}
                              {topScorer.map((p, i) => {
                                const winner = winners.find((w) => w.userId === p.userId);
                                const prize = winner ? winner.prizeAmount : "-";

                                return (
                                  <tr key={i} className={p.userId === userId ? "fw-semibold" : ""}>
                                    <td>{p.rank}</td>
                                    <td className="text-truncate">{p.name}</td>
                                    <td>
                                      {(
                                        (p.correct + p.wrong + p.skipped) > 0
                                          ? (p.score / (p.correct + p.wrong + p.skipped)) * 100
                                          : 0
                                      ).toFixed(2)}
                                      %
                                    </td>
                                    <td>{p.score.toFixed(3)}</td>
                                    <td className={`fw-bold ${winner ? "color-one" : ""}`}>
                                      {prize !== "-" ? `Win ${prize}/-` : "-"}
                                    </td>
                                  </tr>
                                );
                              })}

                            </tbody>
                          </table>
                        </div>
                      </>
                    ) : (
                      <div className="alert alert-primary text-xsm text-center my-2 border-0 mt-3">
                        Results are under review. Winners will be announced soon.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
