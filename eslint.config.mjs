import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    languageOptions: {
      globals: {
        ...globals.node, // Include Node.js globals
        ...globals.jest, // Include Jest globals
      },
    },
  },
  pluginJs.configs.recommended,
];
