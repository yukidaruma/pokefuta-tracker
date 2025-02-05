import * as Mantine from "@mantine/core";
import ExternalLink from "./external-link";

const FooterComponent: React.FC = () => {
  return (
    <footer className="w-full px-2 py-4 bg-gray-800 text-center">
      <p className="text-sm text-gray-300">
        Made with ❄ by{" "}
        <a
          href="https://yuki.games"
          className="hover:underline hover:text-gray-50"
          target="_blank"
        >
          yuki.games
        </a>
        .
      </p>

      <div className="flex items-center justify-center space-x-2 mt-1 text-xs text-gray-400">
        <a
          href="https://github.com/yukidaruma/pokefuta-tracker"
          className="hover:underline hover:text-gray-50"
          target="_blank"
        >
          GitHub
        </a>

        <Mantine.Divider
          h={8}
          className="!border-gray-600 !self-auto"
          orientation="vertical"
        />

        <a
          href="https://x.com/YukiDotGames"
          className="hover:underline hover:text-gray-50"
          target="_blank"
        >
          X
        </a>
      </div>

      <p className="mt-4 text-xs text-gray-400">
        This website is not affiliated with or endorsed by The Pokémon Company,
        Nintendo, Creatures or GAME FREAK. <br />
        All characters and artwork are property of their respective owners.
      </p>
    </footer>
  );
};

export default FooterComponent;
