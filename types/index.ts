import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type ExerciseType = {
  id:number | null,
  name:string,
  img:string | null,
  description:string,
  type:string,
  value:string,
  repetitions:number
}