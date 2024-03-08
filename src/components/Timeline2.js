"use client";
import { Timeline } from "keep-react";
import { CalendarBlank } from "phosphor-react";

export const TimelineComponent2 = () => {
  return (
    <Timeline>
      <div className="timeline__slides mt-5">
        <div className="timeline__slide is-active">
          <div className="timeline__slide-title"></div>
          <div className="timeline__slide-content">
 
          </div>
        </div>
        <div className="timeline__slide">
          <div className="timeline__slide-title">Keep Library v1.1.0</div>
          <div className="timeline__slide-content">

          </div>
        </div>
        <div className="timeline__slide">
          <div className="timeline__slide-title">Keep Library v1.3.0</div>
          <div className="timeline__slide-content">

          </div>
        </div>
      </div>
      <div className="timeline__stepper">
        <div className="timeline__step ">
          <div className="timeline__step-title "><strong>¡Creá tu cuenta!</strong>
          <p className="desaparecerParrafo">Registrate en la web para comenzar</p>
          </div>
        </div>
        <div className="timeline__step">
          <div className="timeline__step-title "><strong>¡Cargá tu cancha!</strong>
            <p className="desaparecerParrafo">Rellená tus datos en "REGISTRAR PREDIO"</p>
          </div>
        </div>
        <div className="timeline__step">
          <div className="timeline__step-title "><strong>¡Relajá!</strong>
            <p className="desaparecerParrafo">Recibí a tus clientes sin preocuparte por mensajería</p>
          </div>
        </div>
      </div>
    </Timeline>
  );
};
