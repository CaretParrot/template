let mathPlus = {
    settings: {
        rounding: 5,
        degrees: false,
        dx: 10 ** -3
    },
    xroot: function (value, power) {
        return Math.pow(value, 1 / power);
    },
    mean: function (array) {
        let total = 0;
        for (let i = 0; i < array.length; i++) {
            total += array[i];
        }

        return total / array.length;
    },
    median: function (array) {
        if (array.length % 2 === 0) {
            return mean([array[array.length / 2 - 1], array[array.length / 2]]);
        } else {
            return Math.floor(array[(array.length - 1) / 2]);
        }
    },
    geoMean: function (array) {
        let total = 1;
        for (let i = 0; i < array.length; i++) {
            total *= array[i];
        }

        return Math.pow(total, 1 / array.length);
    },
    isSquare: function (number) {
        if (number !== 0 && Math.sqrt(number) % 1 === 0) {
            return true;
        } else {
            return false;
        }
    },
    isCube: function (number) {
        if (number !== 0 && Math.cbrt(number) % 1 === 0) {
            return true;
        } else {
            return false;
        }
    },
    factors: function (number) {
        let array = [];
        for (let i = 1; i < number; i++) {
            if (number % i === 0) {
                array.push(i);
            }
        }

        return array;
    },
    convertToFraction: function (number) {
        for (let i = 1; i < 1000000; i++) {
            if ((parseFloat(number) * i) % 1 === 0) {
                return parseFloat(number) * i + "/" + i;
            } else {
                console.warn(
                    "Fraction is too large to compute. The decimal was returned."
                );
                return number;
            }
        }
    },
    simpRadic: function (radicalSquared) {
        if (radicalSquared === 1) {
            console.warn(
                "Given radical has only one square factor: 1. The radical is already simplified. The given number was returned."
            );
            return radicalSquared;
        }

        if (isSquare(radicalSquared)) {
            return Math.sqrt(radicalSquared);
        }

        let squareFactors = [];
        for (let i = 0; i < factors(radicalSquared).length; i++) {
            if (isSquare(factors(radicalSquared)[i])) {
                squareFactors.push(factors(radicalSquared)[i]);
            }
        }

        if (squareFactors.length === 1) {
            console.warn(
                "Given radical has only one square factor: 1. The radical is already simplified. The given number was returned."
            );
            return "√" + radicalSquared;
        }

        let factorToUse = Math.sqrt(Math.max.apply(null, squareFactors));
        return (
            factorToUse + "√" + radicalSquared / Math.max.apply(null, squareFactors)
        );
    },
    hypotenuse: function (number1, number2) {
        return Math.sqrt(number1 ** 2 + number2 ** 2);
    },
    factorial: function (number) {
        if (number > 170) {
            console.warn(
                'Factorial is too large to compute. Factorial of the given number returned "Infinity".'
            );
        }
        let total = 1;
        for (let i = 1; i <= number; i++) {
            total *= i;
        }
        return total;
    },
    roundToPlaces: function (number) {
        if (Math.abs(number) > 0) {
            return Math.round(number * (10 ** mathPlus.settings.rounding)) / (10 ** mathPlus.settings.rounding);
        } else {
            return number;
        }
    },
    toDegrees: function (number) {
        return number * 180 / Math.PI;
    },
    toRadians: function (number) {
        return number * Math.PI / 180;
    },
    MathFunction: function (expression, variable) {
        this.expression = expression;
        this.variable = variable;
        this.evaluate = function (inputVal, rounded = true) {
            if (rounded) {
                return mathPlus.roundToPlaces(Function(`return ${expression.replace(new RegExp(variable, "g"), inputVal)};`)());
            } else {
                return Function(`return ${expression.replace(new RegExp(variable, "g"), inputVal)};`)();
            }
        }
        this.derivative = function (inputVal) {
            return mathPlus.roundToPlaces((this.evaluate(inputVal + mathPlus.settings.dx, false) - this.evaluate(inputVal, false)) / mathPlus.settings.dx);
        }
        this.integral = function (lowerBound, upperBound) {
             const integralPromise = new Promise((resolve, reject) => {
                let sum = 0;
                if (lowerBound < upperBound) {
                    for (i = lowerBound; i <= upperBound - mathPlus.settings.dx; i += mathPlus.settings.dx) {
                        sum += (1 / 2) * (this.evaluate(i) + this.evaluate(i + mathPlus.settings.dx)) * (mathPlus.settings.dx);
                    }

                    resolve(mathPlus.roundToPlaces(sum));
                } else if (lowerBound > upperBound) {
                    for (i = upperBound; i <= lowerBound - mathPlus.settings.dx; i += mathPlus.settings.dx) {
                        sum += (1 / 2) * (this.evaluate(i) + this.evaluate(i + mathPlus.settings.dx)) * (mathPlus.settings.dx);
                    }

                    resolve(-mathPlus.roundToPlaces(sum));
                } else {
                    resolve(0);
                }
            })

            integralPromise.then((result) => {
                return result;
            })
        }
        this.summation = function (lowerBound, upperBound) {
            let sum = 0;
            if (lowerBound >= upperBound) {
                console.error("Upper bound must be greater than lower bound.");
                return 0;
            } else if (lowerBound % 1 !== 0 || upperBound % 1 !== 0) {
                console.error("Summation bounds must be integers.");
                return 0;
            } else {
                for (let i = lowerBound; i <= upperBound; i++) {
                    sum += Function(`return ${expression.replace(new RegExp(variable, "g"), i)};`)();
                }
                return mathPlus.roundToPlaces(sum);
            }
        }
        this.product = function (lowerBound, upperBound) {
            let product = 1;
            if (lowerBound >= upperBound) {
                console.error("Upper bound must be greater than lower bound.");
                return 0;
            } else if (lowerBound % 1 !== 0 || upperBound % 1 !== 0) {
                console.error("Summation bounds must be integers.");
                return 0;
            } else {
                for (let i = lowerBound; i <= upperBound; i++) {
                    product *= Function(`return ${expression.replace(new RegExp(variable, "g"), i)};`)();
                }
                return mathPlus.roundToPlaces(product);
            }
        }
    }
}

function sin(x) {
    if (mathPlus.settings.degrees === true) {
        return Math.sin(mathPlus.toRadians(x));
    } else {
        return Math.sin(x);
    }
}

function sinh(x) {
    if (mathPlus.settings.degrees === true) {
        return Math.sinh(mathPlus.toRadians(x));
    } else {
        return Math.sinh(x);
    }
}

function arcsin(x) {
    if (mathPlus.settings.degrees === true) {
        return mathPlus.toRadians(Math.asin(x));
    } else {
        return Math.asin(x);
    }
}

function arcsinh(x) {
    if (mathPlus.settings.degrees === true) {
        return mathPlus.toRadians(Math.asinh(x));
    } else {
        return Math.asinh(x);
    }
}

function cos(x) {
    if (mathPlus.settings.degrees === true) {
        return Math.cos(mathPlus.toRadians(x));
    } else {
        return Math.cos(x);
    }
}

function cosh(x) {
    if (mathPlus.settings.degrees === true) {
        return Math.cosh(mathPlus.toRadians(x));
    } else {
        return Math.cosh(x);
    }
}

function arccos(x) {
    if (mathPlus.settings.degrees === true) {
        return mathPlus.toRadians(Math.acos(x));
    } else {
        return Math.acos(x);
    }
}

function arccosh(x) {
    if (mathPlus.settings.degrees === true) {
        return mathPlus.toRadians(Math.acosh(x));
    } else {
        return Math.acosh(x);
    }
}

function tan(x) {
    if (mathPlus.settings.degrees === true) {
        return Math.tan(mathPlus.toRadians(x));
    } else {
        return Math.tan(x);
    }
}

function tanh(x) {
    if (mathPlus.settings.degrees === true) {
        return Math.tanh(mathPlus.toRadians(x));
    } else {
        return Math.tanh(x);
    }
}

function arctan(x) {
    if (mathPlus.settings.degrees === true) {
        return mathPlus.toRadians(Math.atan(x));
    } else {
        return Math.atan(x);
    }
}

function arctanh(x) {
    if (mathPlus.settings.degrees === true) {
        return mathPlus.toRadians(Math.atanh(x));
    } else {
        return Math.atanh(x);
    }
}

function csc(x) {
    if (mathPlus.settings.degrees === true) {
        return 1 / Math.sin(mathPlus.toRadians(x));
    } else {
        return 1 / Math.sin(x);
    }
}

function csch(x) {
    if (mathPlus.settings.degrees === true) {
        return 1 / Math.sinh(mathPlus.toRadians(x));
    } else {
        return 1 / Math.sinh(x);
    }
}

function arccsc(x) {
    if (mathPlus.settings.degrees === true) {
        return mathPlus.toRadians(Math.asin(1 / x));
    } else {
        return Math.asin(1 / x);
    }
}

function arccsc(x) {
    if (mathPlus.settings.degrees === true) {
        return mathPlus.toRadians(Math.asinh(1 / x));
    } else {
        return Math.asinh(1 / x);
    }
}

function sec(x) {
    if (mathPlus.settings.degrees === true) {
        return 1 / Math.cos(mathPlus.toRadians(x));
    } else {
        return 1 / Math.cos(x);
    }
}

function sech(x) {
    if (mathPlus.settings.degrees === true) {
        return 1 / Math.cosh(mathPlus.toRadians(x));
    } else {
        return 1 / Math.cosh(x);
    }
}

function arcsec(x) {
    if (mathPlus.settings.degrees === true) {
        return mathPlus.toRadians(Math.acos(1 / x));
    } else {
        return Math.acos(1 / x);
    }
}

function arcsec(x) {
    if (mathPlus.settings.degrees === true) {
        return mathPlus.toRadians(Math.acosh(1 / x));
    } else {
        return Math.acosh(1 / x);
    }
}

function cot(x) {
    if (mathPlus.settings.degrees === true) {
        return 1 / Math.tan(mathPlus.toRadians(x));
    } else {
        return 1 / Math.tan(x);
    }
}

function coth(x) {
    if (mathPlus.settings.degrees === true) {
        return 1 / Math.tanh(mathPlus.toRadians(x));
    } else {
        return 1 / Math.tanh(x);
    }
}

function arccot(x) {
    if (mathPlus.settings.degrees === true) {
        return mathPlus.toRadians(Math.PI / 2 - Math.atan(x));
    } else {
        return Math.PI / 2 - Math.atan(x);
    }
}

function arccoth(x) {
    if (mathPlus.settings.degrees === true) {
        return mathPlus.toRadians(Math.atanh(1 / x));
    } else {
        return Math.atanh(1 / x);
    }
}

function log(x) {
    return Math.log10(x);
}

function logb(b, x) {
    return Math.log(x) / Math.log(b);
}

function ln(x) {
    return Math.log(x);
}

function abs(x) {
    return Math.abs(x);
}

function floor(x) {
    return Math.floor(x);
}

function ceil(x) {
    return Math.ceil(x);
}

function random(x) {
    return Math.random(x);
}

