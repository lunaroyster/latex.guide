const CommandList = [
  {
    command: "\\to",
    example: "\\to",
    descriptions: ["to", "x approaches", "right arrow","映射到","箭头"],
  },
  {
    command: "\\frac{}{}",
    example: "\\frac{a}{b}",
    descriptions: ["fraction", "division","分数"],
  },
  {
    command: "\\sqrt{}",
    example: "\\sqrt{a}",
    descriptions: ["square root", "root", "sqrt","根号"],
  },
  {
    command: "\\geq",
    example: "\\geq",
    descriptions: ["greater than or equal to", ">=","大于等于"],
  },
  {
    command: "\\leq",
    example: "\\leq",
    descriptions: ["less than or equal to", "<=","小于等于"],
  },
  {
    command: "<",
    example: "<",
    descriptions: ["less than", "<","小于"],
  },
  {
    command: ">",
    example: ">",
    descriptions: ["greater than", ">","大于"],
  },
  {
    command: "\\pm",
    example: "\\pm",
    descriptions: ["plus-minus", "+-","正负"],
  },
  {
    command: "=",
    example: "=",
    descriptions: ["equals", "is equal to","等于"],
  },
  {
    command: "\\neq",
    example: "\\neq",
    descriptions: ["not equal to", "!=","不等于"],
  },
  {
    command: "\\approx",
    example: "\\approx",
    descriptions: ["approximately equal to","约等于"],
  },
  {
    command: "\\nless",
    example: "\\nless",
    descriptions: ["not less than","至少","不小于"],
  },
  {
    command: "\\ngtr",
    example: "\\ngtr",
    descriptions: ["not greater than","不大于","小于等于"],
  },
  {
    command: "\\nleq",
    example: "\\nleq",
    descriptions: ["not less than or equal to"],
  },
  {
    command: "\\ngeq",
    example: "\\ngeq",
    descriptions: ["not greater than or equal to"],
  },
  {
    command: "\\infty",
    example: "\\infty",
    descriptions: ["infinity","无穷"],
  },
  {
    command: "\\cdot",
    example: "\\cdot",
    descriptions: ["dot", "dot product","省略号"],
  },
  {
    command: "\\sqrt[n]{}",
    example: "\\sqrt[n]{a}",
    descriptions: ["nth root","方根"],
  },
  {
    command: "^{}",
    example: "x^{a}",
    descriptions: ["exponent", "superscript", "raised to the power","指数"],
  },
  {
    command: "^{\\circ}",
    example: "360^{\\circ}",
    descriptions: ["degree", "degrees","度"],
  },
  {
    command: "_{}",
    example: "x_{a}",
    descriptions: ["subscript","下标"],
  },
  {
    command: "\\gg",
    example: "\\gg",
    descriptions: ["much greater than","远大于"],
  },
  {
    command: "\\ll",
    example: "\\ll",
    descriptions: ["much less than","远小于"],
  },
  {
    command: "\\mathbb{R}",
    example: "\\mathbb{R}",
    descriptions: ["R", "Real Numbers","实数集"],
  },
  {
    command: "\\mathbb{Q}",
    example: "\\mathbb{Q}",
    descriptions: ["Q", "Rational Numbers","有理数集"],
  },
  {
    command: "\\mathbb{Z}",
    example: "\\mathbb{Z}",
    descriptions: ["Z", "Integers","整数集"],
  },
  {
    command: "\\mathbb{N}",
    example: "\\mathbb{N}",
    descriptions: ["N", "Natural Numbers","自然数集"],
  },
  {
    command: "\\circ",
    example: "g \\circ f",
    descriptions: ["Function Composition", "g(f(x))", "g of f","复合函数"],
  },
  {
    command: "\\square",
    example: "\\square",
    descriptions: ["Square"],
  },
  {
    command: "\\blacksquare",
    example: "\\blacksquare",
    descriptions: ["Black Square"],
  },
  {
    command: "\\wedge",
    example: "P \\wedge Q",
    descriptions: ["And","合取","且"],
  },
  {
    command: "\\vee",
    example: "P \\vee Q",
    descriptions: ["Or","析取","或"],
  },
  {
    command: "\\neg{}",
    example: "\\neg{P}",
    descriptions: ["Negation", "Not","非","否定"],
  },
  {
    command: "\\implies",
    example: "P \\implies Q",
    descriptions: [
      "Implies",
      "If P then Q",
      "Material Implication",
      "Conditional",
      "严格蕴含",
    ],
  },
  {
    command: "\\Rightarrow\\Leftarrow",
    example: "\\Rightarrow\\Leftarrow",
    descriptions: ["Contradiction","矛盾"],
  },
  {
    command: "\\mapsto",
    example: "A \\mapsto B",
    descriptions: ["Maps to", "Function mapping", "Map","映射"],
  },
  {
    command: "\\therefore",
    example: "\\therefore",
    descriptions: ["Therefore", "Thus","所以","因此"],
  },
  {
    command: "\\iff",
    example: "P \\iff Q",
    descriptions: ["iff", "If and only if", "Material Equivalence","等价于"],
  },
  {
    command: "\\sin{}",
    example: "\\sin{x}",
    descriptions: ["sin", "sine","正弦"],
  },
  {
    command: "\\cos{}",
    example: "\\cos{x}",
    descriptions: ["cos", "cosine","余弦"],
  },
  {
    command: "\\tan{}",
    example: "\\tan{x}",
    descriptions: ["tan", "tangent","正切"],
  },
  {
    command: "\\csc{}",
    example: "\\csc{x}",
    descriptions: ["csc", "cosec", "cosecant","余割"],
  },
  {
    command: "\\sec{}",
    example: "\\sec{x}",
    descriptions: ["sec", "secant","正割"],
  },
  {
    command: "\\cot{}",
    example: "\\cot{x}",
    descriptions: ["cot", "cotan", "cotangent","余切"],
  },
  {
    command: "\\in",
    example: "a \\in A",
    descriptions: ["is member of", "in", "belongs to set","属于"],
  },
  {
    command: "\\ni",
    example: "A \\ni a",
    descriptions: ["owns", "has member", "reverse in","拥有"],
  },
  {
    command: "\\notin",
    example: "a \\notin A",
    descriptions: ["is not member of", "not in", "doesn't belong to set","不属于"],
  },
  {
    command: "\\subset",
    example: "a \\subset A",
    descriptions: ["is subset of", "proper subset","子集"],
  },
  {
    command: "\\supset",
    example: "A \\supset a",
    descriptions: ["is superset of", "proper superset","包含"],
  },
  {
    command: "\\supseteq",
    example: "A \\supseteq a",
    descriptions: ["is superset of", "improper superset","真包含"],
  },
  {
    command: "\\not\\subset",
    example: "a \\not\\subset A",
    descriptions: ["is not subset of", "not proper subset","不真包含"],
  },
  {
    command: "\\subseteq",
    example: "a \\subseteq A",
    descriptions: ["is subset or equivalent set", "improper subset","真包含"],
  },
  {
    command: "\\nsubseteq",
    example: "a \\nsubseteq A",
    descriptions: ["is not a subset or equivalent set", "not improper subset","不真包含"],
  },
  {
    command: "\\setminus",
    example: "\\mathbb{R} \\setminus \\mathbb{Q}",
    descriptions: ["subtract set","差集","差"],
  },
  {
    command: "\\int_{a}^{b}",
    example: "\\int_{a}^{b}",
    descriptions: ["definite integral","有界积分"],
  },
  {
    command: "\\int",
    example: "\\int",
    descriptions: ["indefinite integral", "integral","积分"],
  },
  {
    command: "\\iint",
    example: "\\iint",
    descriptions: ["double integral","二重积分"],
  },
  {
    command: "\\iiint",
    example: "\\iiint",
    descriptions: ["triple integral","三重积分"],
  },
  {
    command: "\\iiiint",
    example: "\\iiiint",
    descriptions: ["quadruple integral","四重积分"],
  },
  {
    command: "\\oint",
    example: "\\oint",
    descriptions: ["contour integral","环路积分","曲线积分"],
  },
  {
    command: "\\overline{}",
    example: "\\overline{I}",
    descriptions: ["Overline","补元","上横线"],
  },
  {
    command: "\\underline{}",
    example: "\\underline{I}",
    descriptions: ["Underline"],
  },
  {
    command: "\\sum_{}^{}",
    example: "\\sum_{n=0}^{\\infty} x",
    descriptions: ["Sum", "summation", "Sigma"],
    variants: [
      {
        command: "\\sum\\limits_{}^{}",
        example: "\\sum\\limits_{n=0}^{\\infty} x",
      },
    ],
  },
  {
    command: "\\prod_{}^{}",
    example: "\\prod_{n=0}^{\\infty} x",
    descriptions: ["Product"],
  },
  {
    command: "\\pi",
    example: "\\pi",
    descriptions: ["Pi", "3.1415926535", "22/7"],
  },
  {
    command: "e",
    example: "e",
    descriptions: ["e", "2.71828","自然底数"],
  },
  {
    command: "!",
    example: "n!",
    descriptions: ["factorial","阶乘"],
  },
  {
    command: "\\forall",
    example: "\\forall",
    descriptions: ["for all", "given any", "universal quantifier","任一","任何"],
  },
  {
    command: "\\exists",
    example: "\\exists",
    descriptions: ["there exists", "existential quantifier","存在"],
  },
  {
    command: "\\nexists",
    example: "\\nexists",
    descriptions: ["there is no", "there does not exist","不存在"],
  },
  {
    command: "\\exists!",
    example: "\\exists!",
    descriptions: ["there exists one and only one","有且仅有"],
  },
  {
    command: "\\hat{}",
    example: "\\hat{a}",
    descriptions: ["hat","拟合值","预测值"],
  },
  {
    command: "\\widehat{}",
    example: "\\widehat{abc}",
    descriptions: ["widehat"],
  },
  {
    command: "\\nabla",
    example: "\\nabla",
    descriptions: ["nabla", "differential","微分算子","倒三角算子","哈密顿算子","劈形算子"],
  },
  {
    command: "\\times",
    example: "\\times",
    descriptions: ["cross", "cross product", "multiply", "x"],
  },
  {
    command: "\\div",
    example: "\\div",
    descriptions: ["divide", "division", "/","除以"],
  },
  {
    command: "\\cap",
    example: "\\cap",
    descriptions: ["intersection", "set intersection","交"],
  },
  {
    command: "\\cup",
    example: "\\cup",
    descriptions: ["union", "set union","并"],
  },
  {
    command: "\\emptyset",
    example: "\\emptyset",
    descriptions: ["null set", "empty set"],
  },
  {
    command: "\\triangle",
    example: "\\triangle",
    descriptions: ["triangle","三角"],
  },
  {
    command: "\\angle",
    example: "\\angle",
    descriptions: ["angle","角"],
  },
  {
    command: "\\cong",
    example: "\\cong",
    descriptions: ["congruent","全等"],
  },
  {
    command: "\\ncong",
    example: "\\ncong",
    descriptions: ["not congruent","不全等"],
  },
  {
    command: "\\sim",
    example: "\\sim",
    descriptions: ["similar", "tilde","相似","对等","~"],
  },
  {
    command: "\\nsim",
    example: "\\nsim",
    descriptions: ["not similar","不相似","不对等"],
  },
  {
    command: "\\|",
    example: "\\|",
    descriptions: ["parallel","范数","norm"],
  },
  {
    command: "\\nparallel",
    example: "\\nparallel",
    descriptions: ["not parallel"],
  },
  {
    command: "\\perp",
    example: "\\perp",
    descriptions: ["perpendicular","垂直于"],
  },
  {
    command: "\\not\\perp",
    example: "\\not\\perp",
    descriptions: ["not perpendicular","不垂直于"],
  },
  {
    command: "\\overrightarrow{}",
    example: "\\overrightarrow{AB}",
    descriptions: ["ray", "half-line"],
  },
  {
    command: "\\%",
    example: "\\%",
    descriptions: ["percentage", "%","百分"],
  },
  {
    command: "\\textit{}",
    example: "\\textit{italics}",
    descriptions: ["italics", "textit", "italicize","斜体"],
  },
  {
    command: "\\hspace{1in}",
    example: "\\hspace{1in}",
    descriptions: ["empty space", "hspace","水平间距"],
  },
  {
    command: "\\textrm{}",
    example: "\\textrm{Text within equation}",
    descriptions: ["text", "text within equation", "descriptions","粗体"],
  },
  {
    command: "{} \\bmod{}",
    example: "a \\bmod b",
    descriptions: ["mod", "remainder", "bmod","取模","模"],
  },
  {
    command: "{} \\pmod{}",
    example: "a \\pmod b",
    descriptions: ["mod", "remainder", "pmod","取模","模"],
  },
  {
    command: "\\equiv",
    example: "\\equiv",
    descriptions: ["equals", "equivalent","恒等于","恒成立"],
  },
  {
    command: "\\partial",
    example: "\\partial",
    descriptions: ["partial derivative", "derivative","导数","偏导数"],
  },
  {
    command: "\\vec{}",
    example: "\\vec{a}",
    descriptions: ["vector","向量"],
  },
  {
    command: "\\underbrace{}_{}",
    example: "\\underbrace{a+b+c}_{a sum}",
    descriptions: ["underbrace","和"],
  },
  {
    command: "\\overbrace{}_{}",
    example: "\\overbrace{a+b+c}_{a sum}",
    descriptions: ["overbrace","和"],
  },
  {
    command: "\\ldots",
    example: "\\ldots",
    descriptions: ["dots", "...", "left", "horizontal"],
  },
  {
    command: "\\vdots",
    example: "\\vdots",
    descriptions: ["dots", "...", "down", "vertical"],
  },
  {
    command: `\\begin{bmatrix}
    a & b \\\\
    c & d
    \\end{bmatrix}`,
    example: `\\begin{bmatrix}
    a & b \\\\
    c & d
    \\end{bmatrix}`,
    descriptions: ["matrix", "bmatrix", "matrix with brackets","矩阵"],
    variants: [
      {
        command: `\\left[\\begin{array}{}
        a & b \\\\
        c & d
        \\end{array}\\right]`,
        example: `\\left[\\begin{array}{}
        a & b \\\\
        c & d
        \\end{array}\\right]`,
      },
    ],
  },
  {
    command: `\\begin{pmatrix}
    a & b \\\\
    c & d
    \\end{pmatrix}`,
    example: `\\begin{pmatrix}
    a & b \\\\
    c & d
    \\end{pmatrix}`,
    descriptions: ["matrix", "pmatrix", "matrix with parenthesis","矩阵"],
    variants: [
      {
        command: `\\left(\\begin{array}{}
        a & b \\\\
        c & d
        \\end{array}\\right)`,
        example: `\\left(\\begin{array}{}
        a & b \\\\
        c & d
        \\end{array}\\right)`,
      },
    ],
  },
  {
    command: `\\left[\\begin{array}{cc|c}
    1 & 0 & 12 \\\\
    0 & 1 & 13
    \\end{array}\\right]`,
    example: `\\left[\\begin{array}{cc|c}
      1 & 0 & 12 \\\\
      0 & 1 & 13
      \\end{array}\\right]`,
    descriptions: ["augmented matrix"],
  },
  {
    command: "\\lfloor {} \\rfloor",
    example: "\\lfloor {\\pi} \\rfloor",
    descriptions: ["round down", "floor"],
  },
  {
    command: "\\lceil {} \\rceil",
    example: "\\lceil {\\pi} \\rceil",
    descriptions: ["round up", "ceil","向上取整"],
  },
  // {
  //   command: `f(n) = \left\{\begin{array}{cl}
  //             {} & \textrm{if } {}\\
  //             {} & \textrm{if } {}\\
  //             {} &\textrm{if } {}
  //             \end{array}
  //             \right. %empty place holder right brace`,
  //   example: `f(n) = \left\\begin{array}{cl}
  //               0 & \textrm{if } n = 0\\
  //               1 & \textrm{if } n = 1\\
  //               f(n-1) + f(n-2) &\textrm{if } n\geq 2
  //               \end{array}
  //                \right. %empty place holder right brace`,
  //   descriptions: ['compound function','function','piecewise functions'],
  // },
];

const greekAlphabet = [
  { command: "\\alpha", example: "\\alpha", descriptions: ["Alpha"] },
  { command: "\\beta", example: "\\beta", descriptions: ["Beta"] },
  { command: "\\gamma", example: "\\gamma", descriptions: ["Gamma"] },
  { command: "\\delta", example: "\\delta", descriptions: ["delta"] },
  { command: "\\Delta", example: "\\Delta", descriptions: ["Delta"] },
  { command: "\\epsilon", example: "\\epsilon", descriptions: ["Epsilon"] },
  { command: "\\zeta", example: "\\zeta", descriptions: ["Zeta"] },
  { command: "\\eta", example: "\\eta", descriptions: ["Eta"] },
  { command: "\\theta", example: "\\theta", descriptions: ["Theta"] },
  { command: "\\iota", example: "\\iota", descriptions: ["Iota"] },
  { command: "\\kappa", example: "\\kappa", descriptions: ["Kappa"] },
  { command: "\\lambda", example: "\\lambda", descriptions: ["Lambda"] },
  { command: "\\mu", example: "\\mu", descriptions: ["Mu"] },
  { command: "\\nu", example: "\\nu", descriptions: ["Nu"] },
  { command: "\\omicron", example: "\\omicron", descriptions: ["Omicron"] },
  // Pi in CommandList
  { command: "\\rho", example: "\\rho", descriptions: ["Rho"] },
  { command: "\\sigma", example: "\\sigma", descriptions: ["Sigma"] },
  { command: "\\tau", example: "\\tau", descriptions: ["Tau"] },
  { command: "\\upsilon", example: "\\upsilon", descriptions: ["Upsilon"] },
  { command: "\\phi", example: "\\phi", descriptions: ["Phi"] },
  { command: "\\chi", example: "\\chi", descriptions: ["Chi"] },
  { command: "\\psi", example: "\\psi", descriptions: ["Psi"] },
  { command: "\\omega", example: "\\omega", descriptions: ["Omega"] },
];

export default [...CommandList, ...greekAlphabet];
