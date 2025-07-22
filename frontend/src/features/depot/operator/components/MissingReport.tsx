//Componente con toda la parte visual del faltante , en caso de producirse faltante: 
import React from "react";
import LogoPersona from "../../../../assets/icon-person.png"

interface Props {
    desciption: string; 
    onDescriptionChange : (value:string) => void;
    onSumbit: () => void; 
}

export const MissingReportComponent: React.FC<Props> = ({desciption,onDescriptionChange,onSumbit,}) => {
    return(
        <div>
            <img src={LogoPersona} alt="Logo Persona" style={{ width: 80, height: 80, marginBottom: 16 }} />
            <h2 style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>
                Emitir notificacion del faltante:
            </h2>

            <textarea
                placeholder="Descripción del faltante"
                value={desciption}
                onChange={(e) => onDescriptionChange(e.target.value)}
                style={{
                    width: "100%",
                    height: 150,
                    backgroundColor: "#e5e7eb", // gray-200
                    padding: 8,
                    borderRadius: 8,
                    resize: "vertical",
                }}
            />
            <button
                onClick={onSumbit}
                style={{
                    backgroundColor: "#f87171", // red-400
                    padding: "10px 24px",
                    borderRadius: 8,
                    marginTop: 16,
                    color: "white",
                    border: "none",
                    cursor: "pointer"
                }}
            >
                Enviar Reporte
            </button>
        </div>
    )
}
