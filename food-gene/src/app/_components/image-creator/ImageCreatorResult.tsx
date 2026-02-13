"use client";

type Props = {
  imageUrl: string | null;
};

export const ImageCreatorResult = ({ imageUrl }: Props) => {
  return (
    <div className="border-t border-gray-200 pt-6">
      <div className="flex items-center gap-2">
        <span className="text-base font-semibold text-gray-900">Result</span>
      </div>

      {!imageUrl ? (
        <p className="mt-2 text-sm text-gray-500">
          First, enter your text to generate an image.
        </p>
      ) : (
        <img
          src={imageUrl}
          alt="generated food"
          className="mt-4 max-h-80 rounded-lg border"
        />
      )}
    </div>
  );
}
