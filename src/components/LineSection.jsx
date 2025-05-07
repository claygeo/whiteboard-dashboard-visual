import LineCard from './LineCard';

const LineSection = ({ line, batches, language }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md mb-4">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">🏭 {line}</h3>
      {batches.length === 0 ? (
        <p className="text-center text-gray-600 text-xl">
          {language === 'en'
            ? 'No batches for this line.'
            : 'No hay lotes para esta línea.'}
        </p>
      ) : (
        <div className="space-y-4">
          {batches.map((row) => (
            <LineCard key={row.id} {...row} language={language} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LineSection;
