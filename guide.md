npm init
npm i typescript -D
npx tsc --init



tsconfig.json:

{
  "compilerOptions": {
    /* Base Options: */
    "esModuleInterop": true,
    "skipLibCheck": true,
    "target": "es2022",
    "allowJs": true,
    "resolveJsonModule": true,
    "moduleDetection": "force",
    "isolatedModules": true,
    "verbatimModuleSyntax": true,

    /* Strictness */
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,

    /* If transpiling with TypeScript: */
    "module": "NodeNext",
    "outDir": "dist",
    "sourceMap": true,

    /* AND if you're building for a library: */
    "declaration": true,

    /* AND if you're building for a library in a monorepo: */
    "composite": true,
    "declarationMap": true,

    /* If NOT transpiling with TypeScript: */
    "module": "preserve",
    "noEmit": true,

    /* If your code runs in the DOM: */
    "lib": ["es2022", "dom", "dom.iterable"],

    /* If your code doesn't run in the DOM: */
    "lib": ["es2022"]
  }
}



npx tsc
<!-- OR -->
npx tsc -p .
-p = project
. = current folder
<!-- use when have multiple config files -->
ex:
npx tsc -p .
npx tsc -p tscconfig.json
npx tsc -p tscconfig.build.json
<!-- OR -->
npx tsc -w
<!-- OR -->
npm i tsx -D
npx tsx src/index.ts
npx tsx watch src/index.ts
<!-- OR -->
<!-- (Recommended - faster,no config) -->
npm i tsc-watch -D
npx tsc-watch --onSuccess "node dist/index.js"