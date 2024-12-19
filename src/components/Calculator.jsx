import { useEffect, useState } from "react";

// Components
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Icons
import Delete from "lucide-react/dist/esm/icons/delete";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BASIC_OPS = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "×": (a, b) => a * b,
  "÷": (a, b) => {
    if (b === 0) throw new Error("Division by 0");
    return a / b;
  },
};

const SCIENTIFIC_OPS = {
  sin: (x, isDegrees) => (isDegrees ? Math.sin((x * Math.PI) / 180) : Math.sin(x)),
  cos: (x, isDegrees) => (isDegrees ? Math.cos((x * Math.PI) / 180) : Math.cos(x)),
  tan: (x, isDegrees) => (isDegrees ? Math.tan((x * Math.PI) / 180) : Math.tan(x)),
  square: (x) => x * x,
  sqrt: (x) => {
    if (x < 0) throw new Error("Root of negative number");
    return Math.sqrt(x);
  },
};

export default function Calculator(props = {}) {
  const [value, setValue] = useState(0);
  const [display, setDisplay] = useState("0");
  const [lastOperation, setLastOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(true);
  const [mode, setMode] = useState("Scientific");
  const [isInitial, setIsInitial] = useState(true);
  const [isDegrees, setIsDegrees] = useState(true);

  useEffect(() => {
    setIsInitial(value === 0 && display === "0" && waitingForOperand === true);
  }, [value, display, waitingForOperand]);

  const layouts = {
    Basic: [
      ["C", "backspace", null, "÷"],
      ["7", "8", "9", "×"],
      ["4", "5", "6", "-"],
      ["1", "2", "3", "+"],
      ["0", ".", "=", null],
    ],
    Scientific: [
      ["C", "backspace", "deg", "÷"],
      ["sin", "cos", "tan", "×"],
      ["7", "8", "9", "-"],
      ["4", "5", "6", "+"],
      ["1", "2", "3", "x²"],
      ["0", ".", "=", "√"],
    ],
  };

  const buttons = {
    C: {
      variant: "destructive",
      onClick: isInitial ? clearAll : clearEntry,
      content: isInitial ? "C" : "CE",
    },
    backspace: {
      variant: "secondary",
      onClick: backspace,
      content: <Delete className="h-4 w-4" />,
    },
    deg: {
      variant: "secondary",
      onClick: () => setIsDegrees(!isDegrees),
      content: isDegrees ? "DEG" : "RAD",
    },
    "=": { variant: "ghost", onClick: handleEquals },
    "÷": { variant: "secondary", onClick: () => basicOperation("÷") },
    "×": { variant: "secondary", onClick: () => basicOperation("×") },
    "-": { variant: "secondary", onClick: () => basicOperation("-") },
    "+": { variant: "secondary", onClick: () => basicOperation("+") },
    sin: { variant: "secondary", onClick: () => scientificOperation("sin") },
    cos: { variant: "secondary", onClick: () => scientificOperation("cos") },
    tan: { variant: "secondary", onClick: () => scientificOperation("tan") },
    "x²": { variant: "secondary", onClick: () => scientificOperation("square") },
    "√": { variant: "secondary", onClick: () => scientificOperation("sqrt") },
    ".": { variant: "outline", onClick: inputDot },
  };

  const selectedLayout = layouts[mode].map((row, i) => {
    return row.map((content, j) => {
      const key = `${i}-${j}`;
      if (content === null) return <div key={key} />;
      const config = buttons[content] ?? {
        variant: "outline",
        onClick: () => inputDigit(parseInt(content, 10)),
        content,
      };
      return (
        <Button key={key} variant={config.variant} onClick={config.onClick}>
          {config.content ?? content}
        </Button>
      );
    });
  });

  function basicOperation(operator) {
    handleOperation("basic", operator);
  }

  function scientificOperation(operator) {
    handleOperation("scientific", operator);
  }

  function handleEquals() {
    handleOperation("equals");
  }

  // Unified operation handler
  function handleOperation(kind, operator = null) {
    try {
      let result;
      if (kind === "basic") {
        if (!lastOperation || lastOperation.kind !== "basic") {
          // Start new basic operation
          setLastOperation({ kind, operator, value });
          setWaitingForOperand(true);
          return;
        }
        // Perform the stored operation
        result = BASIC_OPS[lastOperation.operator](lastOperation.value, value);
        setLastOperation({ kind, operator, value: result });
      } else if (kind === "scientific") {
        if (!lastOperation || waitingForOperand) {
          result = SCIENTIFIC_OPS[operator](value, isDegrees);
        } else {
          result = SCIENTIFIC_OPS[lastOperation.operator](value, isDegrees);
        }
        setLastOperation(null);
      } else if (kind === "equals") {
        // Nothing to calculate
        if (!lastOperation) return;
        if (lastOperation.kind === "basic") {
          result = BASIC_OPS[lastOperation.operator](lastOperation.value, value);
        } else if (lastOperation.kind === "scientific") {
          result = SCIENTIFIC_OPS[lastOperation.operator](value, isDegrees);
        }
        setLastOperation(null);
      }

      setValue(result);
      setDisplay(formatNumber(result));
      setWaitingForOperand(true);
      return result;
    } catch {
      setValue(0);
      setDisplay("ERROR");
      setLastOperation(null);
      setWaitingForOperand(true);
      return null;
    }
  }

  function formatNumber(num) {
    if (!Number.isFinite(num)) {
      return "ERROR";
    }
    if (Math.abs(num) > Number.MAX_SAFE_INTEGER) {
      return "ERROR";
    }
    if (Math.abs(num) > 999_999_999_999 || Math.abs(num) < 0.0001) {
      return num.toExponential(2);
    }
    const formatter = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 8,
    });
    return formatter.format(num);
  }

  function clearEntry() {
    setValue(0);
    setDisplay("0");
    setWaitingForOperand(true);
  }

  function clearAll() {
    setValue(0);
    setDisplay("0");
    setLastOperation(null);
    setWaitingForOperand(true);
  }

  function backspace() {
    if (display.length > 1) {
      const nextDisplay = display.slice(0, -1);
      setDisplay(nextDisplay);
      setValue(parseFloat(nextDisplay));
    } else {
      setValue(0);
      setDisplay("0");
      setWaitingForOperand(true);
    }
  }

  function inputDigit(digit) {
    if (waitingForOperand) {
      const nextValue = digit;
      setValue(nextValue);
      setDisplay(String(nextValue));
      setWaitingForOperand(false);
    } else {
      const nextDisplay = display === "0" ? String(digit) : display + digit;
      setValue(parseFloat(nextDisplay));
      setDisplay(nextDisplay);
    }
  }

  function inputDot() {
    if (waitingForOperand) {
      setValue(0);
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <Select value={mode} onValueChange={setMode}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(layouts).map((mode) => (
                <SelectItem key={mode} value={mode}>
                  {mode}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className="min-h-12 rounded-lg bg-neutral-100 p-4 text-right font-mono text-2xl dark:bg-neutral-800"
          data-testid="calculator-display"
        >
          {display}
        </div>
        <div className="grid grid-cols-4 gap-2">{selectedLayout}</div>
      </CardContent>
    </Card>
  );
}
