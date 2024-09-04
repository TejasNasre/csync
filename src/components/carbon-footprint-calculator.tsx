"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Shovel,
  Truck,
  HardHat,
  Zap,
  Thermometer,
  Wind,
  Plus,
  HelpCircle,
} from "lucide-react";

type FormInputs = {
  excavation: string;
  transportation: string;
  equipment: string;
  electricity: string;
  heat: string;
  air: string;
  other: string;
};

const factors = [
  {
    name: "excavation",
    icon: Shovel,
    unit: "tons",
    tooltip: "Amount of coal excavated",
  },
  {
    name: "transportation",
    icon: Truck,
    unit: "km",
    tooltip: "Distance traveled for coal transportation",
  },
  {
    name: "equipment",
    icon: HardHat,
    unit: "hours",
    tooltip: "Hours of equipment operation",
  },
  {
    name: "electricity",
    icon: Zap,
    unit: "kWh",
    tooltip: "Electricity consumed in operations",
  },
  {
    name: "heat",
    icon: Thermometer,
    unit: "BTU",
    tooltip: "Heat energy used in processes",
  },
  { name: "air", icon: Wind, unit: "m³", tooltip: "Air quality impact" },
  {
    name: "other",
    icon: Plus,
    unit: "kg CO2e",
    tooltip: "Other sources of emissions",
  },
];

const emissionFactors = {
  excavation: 0.8,
  transportation: 0.1,
  equipment: 2.5,
  electricity: 0.5,
  heat: 0.0001,
  air: 0.02,
  other: 1,
};

export default function CarbonFootprintCalculator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [totalEmissions, setTotalEmissions] = useState(0);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    const total = Object.entries(data).reduce((sum, [factor, value]) => {
      return (
        sum +
        (parseFloat(value) || 0) *
          emissionFactors[factor as keyof typeof emissionFactors]
      );
    }, 0);
    setTotalEmissions(total);
    setCurrentStep(factors.length);
  };

  const handleNext = () =>
    setCurrentStep((prev) => Math.min(prev + 1, factors.length - 1));
  const handlePrev = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8 flex items-center justify-center">
      <Card className="w-full h-full max-w-4xl bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-gray-200 border-opacity-20 shadow-xl">
        <CardContent className="h-full p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">
              Coal Mining Carbon Footprint Calculator
            </h2>
            <div className="relative w-20 h-20">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-gray-700 opacity-20"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-white"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                  strokeDasharray={`${
                    (currentStep / (factors.length - 1)) * 251.2
                  } 251.2`}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute text-white inset-0 flex items-center justify-center text-lg font-semibold">
                {currentStep + 1}/{factors.length}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div
              className="relative overflow-hidden"
              style={{ height: "300px" }}
            >
              {factors.map((factor, index) => (
                <div
                  key={factor.name}
                  className="absolute top-0 left-0 w-full transition-all duration-500 ease-in-out"
                  style={{
                    transform: `translateX(${(index - currentStep) * 100}%)`,
                    opacity: index === currentStep ? 1 : 0,
                  }}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <factor.icon size={48} className="text-white" />
                    <h3 className="text-xl text-white font-semibold capitalize">
                      {factor.name}
                    </h3>
                    <div className="w-full max-w-md">
                      <Label
                        htmlFor={factor.name}
                        className="flex text-white items-center space-x-2 mb-2"
                      >
                        <span>
                          Enter {factor.name} ({factor.unit}):
                        </span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle size={16} className="text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{factor.tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <Input
                        id={factor.name}
                        type="number"
                        placeholder={`Enter value in ${factor.unit}`}
                        {...register(factor.name as keyof FormInputs, {
                          required: true,
                          min: 0,
                        })}
                        className="bg-white bg-opacity-10 border-gray-200 border-opacity-20 text-white placeholder-gray-400"
                      />
                      {errors[factor.name as keyof FormInputs] && (
                        <span className="text-red-400 text-sm mt-1">
                          This field is required and must be non-negative
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {currentStep === factors.length && (
                <div className="absolute h-full text-white top-0 left-0 w-full">
                  <h3 className="text-xl font-semibold text-center mb-4">
                    Carbon Footprint Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {factors.map((factor) => (
                      <div
                        key={factor.name}
                        className="flex justify-between items-center"
                      >
                        <span className="capitalize">{factor.name}:</span>
                        <span>
                          {watch(factor.name as keyof FormInputs) || "0"}{" "}
                          {factor.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="text-3xl font-bold text-center text-white">
                    Total Emissions: {totalEmissions.toFixed(2)} kg CO2e
                  </div>
                  <div className="mt-8 flex justify-center">
                    <div className="relative w-64 h-64">
                      <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold">
                        {Math.min((totalEmissions / 1000) * 100, 100).toFixed(
                          1
                        )}
                        % of 1000 kg CO2e
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between mt-8">
              <Button
                type="button"
                onClick={handlePrev}
                disabled={currentStep === 0}
                variant="outline"
                className="bg-white bg-opacity-10 text-white border-gray-200 border-opacity-20 hover:bg-white hover:bg-opacity-20"
              >
                Previous
              </Button>
              {currentStep < factors.length - 1 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="bg-white text-black hover:bg-gray-200"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="bg-white text-black hover:bg-gray-200"
                >
                  Calculate
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
