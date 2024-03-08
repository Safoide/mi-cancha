import { Timeline } from "keep-react";
import { CalendarBlank } from "phosphor-react";

export const TimelineComponentPlayer = () => {
  return (
    <Timeline>
      <div className="timeline__slides mt-5 ">
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
          <div className="timeline__step-title"><strong>¡Creá tu cuenta!</strong> 
          <p className="desaparecerParrafo">Registrate en la web para comenzar</p>
          </div>
        </div>
        <div className="timeline__step">
          <div className="timeline__step-title"><strong>¡Buscá tu cancha favorita!</strong>
            <p className="desaparecerParrafo">Podes buscarlas dentro del listado de canchas</p>
          </div>
        </div>
        <div className="timeline__step">
          <div className="timeline__step-title"><strong>¡Reservá!</strong>
            <p className="desaparecerParrafo">Elegí el día y horario que quieras, reservá y a jugar</p>
          </div>
        </div>
      </div>
    </Timeline>
  );
};