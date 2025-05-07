const Podium = ({ shiftScores }) => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Shift Leaderboard</h2>
      <div className="flex justify-around">
        {shiftScores.map((shift, index) => (
          <div
            key={shift.shift}
            className={`p-4 ${index === 0 ? 'bg-yellow-300' : index === 1 ? 'bg-blue-300' : 'bg-purple-300'}`}
          >
            <p className="text-xl font-bold">
              {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'} {shift.shift}{' '}
              Shift
            </p>
            <p>{Math.round(shift.score)} Points</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Podium;
