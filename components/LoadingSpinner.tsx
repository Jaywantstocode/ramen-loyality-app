export default function LoadingSpinner() {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      <span className="mt-3 text-orange-500 font-medium">読み込み中...</span>
    </div>
  );
} 