import { Box, keyframes } from "@mui/material";
import { FC, useState } from "react";
import { AddPlantDialog } from "./AddPlantDialog";
import { PlantDto } from "@/lib/api/generated/generated-api";
import { baseURL } from "@/lib/constans";
import { api } from "@/lib/api/api";
import { useQueryClient } from "@tanstack/react-query";
import { myGardenQueryKeys } from "./queries";
import { PlantDetailsDialog } from "./PlantDetailsDialog";

interface GardenProps {
  plants: PlantDto[];
}

const COLS = 5;
const ROWS = 5;

export const Garden: FC<GardenProps> = ({ plants }) => {
  const queryClient = useQueryClient();
  const [addDialog, setAddDialog] = useState<
    { x: number; y: number } | undefined
  >(undefined);
  const [selectedPlant, setSelectedPlant] = useState<string | undefined>(
    undefined
  );

  return (
    <>
      <Box
        position="relative"
        sx={{
          margin: "0 auto",
          width: (TILE_WIDTH + GAP) * COLS,
          height: (TILE_HEIGHT + GAP) * ROWS + 60,
        }}
      >
        {new Array(COLS).fill(true).map((_, x) =>
          new Array(ROWS).fill(true).map((_, y) => {
            const plant = plants.find(
              (plant) => plant.x === x && plant.y === y
            );

            return (
              <Tile
                plant={plant}
                x={x}
                y={y}
                onCloseDetails={() => {
                  setSelectedPlant(undefined);
                }}
                selected={plant ? plant.id === selectedPlant : false}
                onClick={() => {
                  if (plant) {
                    setSelectedPlant(plant.id!);
                  } else {
                    setAddDialog({ x, y });
                  }
                }}
              />
            );
          })
        )}
      </Box>
      <AddPlantDialog
        isOpen={addDialog !== undefined}
        onSelect={async (plantType) => {
          await api.myGarden.addPlant({
            plantTypeId: plantType.id,
            plantedAt: new Date().toISOString(),
            x: addDialog?.x,
            y: addDialog?.y,
          });
          queryClient.invalidateQueries({
            queryKey: myGardenQueryKeys.myGarden(),
          });
        }}
        onClose={() => {
          setAddDialog(undefined);
        }}
      />
    </>
  );
};

interface TileProps {
  x: number;
  y: number;
  plant?: PlantDto;
  onClick: VoidFunction;
  onCloseDetails: VoidFunction;
  selected?: boolean;
}

const TILE_WIDTH = 75;
const TILE_HEIGHT = TILE_WIDTH * 0.645;
const GAP = 5;

const Tile: FC<TileProps> = ({
  x,
  y,
  plant,
  onClick,
  selected,
  onCloseDetails,
}) => {
  return (
    <>
      {" "}
      <Box
        onClick={onClick}
        sx={{
          position: "absolute",
          width: TILE_WIDTH,
          height: TILE_HEIGHT,
          cursor: "pointer",
          left:
            155 +
            (x * TILE_WIDTH) / 2 +
            x * GAP -
            (y * TILE_WIDTH) / 2 -
            y * GAP,
          top:
            (x * TILE_HEIGHT) / 2 +
            (x * GAP) / 2 +
            (y * TILE_HEIGHT) / 2 +
            y * GAP,
          "&:hover": {
            filter: "brightness(1.2)",
          },
        }}
      >
        {plant && (
          <Box
            sx={{
              position: "absolute",
              zIndex: 1,
              top: 0,
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Box
              component="img"
              src={`${baseURL}${plant.plantType?.imageUrl}`}
              sx={{
                width: TILE_WIDTH / 1.5,
                animation: `${plantAnimation} 2s`,
                transformOrigin: "bottom",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                width: 30,
                height: 30,
                background: "rgba(0,0,0, 0.2)",
                borderRadius: "50%",
                filter: "blur(3px)",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, 30%)",
                zIndex: -1,
              }}
            />
          </Box>
        )}
        <Box component="img" src="grass-tile.svg" />
      </Box>
      {plant && (
        <PlantDetailsDialog
          plant={plant}
          isOpen={!!selected}
          onClose={onCloseDetails}
        />
      )}
    </>
  );
};

const plantAnimation = keyframes`
0% {
  transform: scale(0)
}
100% {
  transform: scale(1)
}
`;
