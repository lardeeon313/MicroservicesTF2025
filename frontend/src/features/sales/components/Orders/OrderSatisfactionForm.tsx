import { Formik, Form, Field, ErrorMessage, useField } from "formik";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import logoVerona from "../../../../assets/logo-verona.png";
import { createOrderSatisfaction } from "../../services/OrderSatisfactionService";
import { orderSatisfactionValidationSchema } from "../../validations/orderSatisfactionValidation";

// Componente para las Cards de valoración
const ScoreCard = ({ value, label, color, bgColor, ringColor }: { 
  value: number; 
  label: string; 
  color: string;
  bgColor: string;
  ringColor: string;
}) => {
  const [field, , helpers] = useField("score");
  const isActive = field.value === value;

  return (
    <button
      type="button"
      onClick={() => helpers.setValue(value)}
      className={`group flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 transform ${
        isActive 
          ? `border-gray-300 ${bgColor} ring-2 ${ringColor} ring-offset-1 sm:ring-offset-2 shadow-lg scale-105` 
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md hover:scale-102 hover:-translate-y-1"
      }`}
    >
      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${color} mb-2 transition-all duration-300 ${
        isActive ? "scale-110 shadow-lg" : "group-hover:scale-110"
      } flex items-center justify-center`}>
        {isActive && (
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </div>
      <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wide transition-colors text-center leading-tight ${
        isActive ? "text-gray-900" : "text-gray-600 group-hover:text-gray-900"
      }`}>
        {label}
      </span>
    </button>
  );
};

const OrderSatisfactionForm = () => {
  const [params] = useSearchParams();
  const token = params.get("token");

  const initialValues = {
    score: 5,
    comment: ""
  };

  const handleSubmit = async (values: typeof initialValues) => {
    console.log("📝 Submit satisfacción");
    console.log("Token:", token);
    console.log("Score:", values.score);
    console.log("Comment:", values.comment);
    if (!token) {
      toast.error("El enlace no es válido.");
      return;
    }

    try {
      await createOrderSatisfaction({
        token,
        score: values.score,
        comment: values.comment
      });
      toast.success("¡Gracias por tu valoración!");
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("Error inesperado.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gradient-to-br from-gray-50 via-red-50 to-gray-50 px-4 sm:px-6 py-8 sm:py-12 lg:px-8">
      <div className="w-full mx-auto max-w-md sm:max-w-lg bg-white p-5 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 backdrop-blur-sm">
        
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-block p-2.5 sm:p-3 bg-gradient-to-br from-red-50 to-red-100 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 shadow-sm">
            <img src={logoVerona} alt="logo-verona" className="h-16 sm:h-20 w-auto" />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
            ¿Cómo fue tu experiencia?
          </h2>
          <p className="text-xs sm:text-sm lg:text-base text-gray-600 max-w-md mx-auto leading-relaxed px-2">
            Tu opinión nos ayuda a brindarte <br></br> un mejor servicio cada día
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={orderSatisfactionValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5 sm:space-y-6">
              
              {/* SECCIÓN DE CARDS */}
              <div className="bg-gradient-to-br from-gray-50 to-white p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl border border-gray-200 shadow-inner">
                <label className="block text-center text-xs sm:text-sm font-bold text-gray-800 mb-4 sm:mb-5 uppercase tracking-wider">
                  ✨ Califica tu experiencia
                </label>
                <div className="grid grid-cols-5 gap-2 sm:gap-2.5 lg:gap-3">
                  <ScoreCard 
                    value={1} 
                    label="Muy Malo" 
                    color="bg-red-500"
                    bgColor="bg-red-50"
                    ringColor="ring-red-300"
                  />
                  <ScoreCard 
                    value={2} 
                    label="Malo" 
                    color="bg-orange-500"
                    bgColor="bg-orange-50"
                    ringColor="ring-orange-300"
                  />
                  <ScoreCard 
                    value={3} 
                    label="Regular" 
                    color="bg-yellow-500"
                    bgColor="bg-yellow-50"
                    ringColor="ring-yellow-300"
                  />
                  <ScoreCard 
                    value={4} 
                    label="Bueno" 
                    color="bg-lime-500"
                    bgColor="bg-lime-50"
                    ringColor="ring-lime-300"
                  />
                  <ScoreCard 
                    value={5} 
                    label="Excelente" 
                    color="bg-green-500"
                    bgColor="bg-green-50"
                    ringColor="ring-green-300"
                  />
                </div>
                <ErrorMessage 
                  name="score" 
                  component="div" 
                  className="text-red-600 text-center text-xs mt-3 font-semibold bg-red-50 py-2 rounded-lg" 
                />
              </div>

              {/* COMENTARIO */}
              <div className="bg-gradient-to-br from-gray-50 to-white p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl border border-gray-200 shadow-inner">
                <label className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm font-semibold text-gray-800 mb-3">
                  <span className="flex items-center gap-1.5">
                    <span className="text-base sm:text-lg">💭</span>
                    <span>¿Quieres decirnos algo más?</span>
                  </span>
                  <span className="text-xs font-normal text-gray-500 sm:ml-1">(Opcional)</span>
                </label>
                <Field
                  as="textarea"
                  name="comment"
                  rows={4}
                  placeholder="Comparte tus comentarios, sugerencias o experiencias..."
                  className="block w-full rounded-xl border-2 border-gray-200 shadow-sm focus:border-red-500 focus:ring-4 focus:ring-red-100 text-sm sm:text-base p-3 sm:p-4 transition-all duration-200 resize-none bg-white hover:border-gray-300"
                />
                <ErrorMessage 
                  name="comment" 
                  component="div" 
                  className="text-red-600 text-xs mt-2 font-medium bg-red-50 py-1.5 px-3 rounded-lg inline-block" 
                />
              </div>

              {/* BOTÓN ENVIAR */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative flex w-full justify-center items-center gap-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-red-600 to-red-700 px-5 sm:px-6 py-3.5 sm:py-4 text-sm font-bold text-white shadow-xl shadow-red-200 transition-all duration-300 hover:from-red-700 hover:to-red-800 hover:shadow-2xl hover:shadow-red-300 hover:-translate-y-0.5 active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </>
                ) : (
                  <>
                    <span>ENVIAR VALORACIÓN</span>
                    <span className="text-lg group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </>
                )}
              </button>
            </Form>
          )}
        </Formik>

        {/* Footer */}
        <p className="text-center text-[10px] sm:text-xs text-gray-500 mt-5 sm:mt-6">
          🔒 Tu información está segura y es confidencial
        </p>
      </div>
    </div>
  );
};

export default OrderSatisfactionForm;