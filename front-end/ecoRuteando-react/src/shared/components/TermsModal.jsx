import { useTheme } from "../../app/context/ThemeContext";

const ShieldCheckIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const CloseIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function TermsModal({ isOpen, onClose, onAccept, showAcceptButton = true }) {
  const { isDarkMode } = useTheme();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl border shadow-2xl transition-all ${
          isDarkMode ? "bg-[#111C20] border-[#26383D] text-gray-200" : "bg-white border-gray-100 text-gray-800"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado */}
        <div className={`p-6 border-b flex items-center justify-between shrink-0 ${
          isDarkMode ? "border-[#26383D]" : "border-gray-100"
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <ShieldCheckIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className={`text-xl font-black ${isDarkMode ? "text-emerald-400" : "text-emerald-800"}`}>
                Términos y Condiciones de Uso
              </h2>
              <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Plataforma EcoRuteando · Última actualización: 18 de octubre de 2026
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${
              isDarkMode ? "hover:bg-[#162329] text-gray-400" : "hover:bg-gray-100 text-gray-500"
            }`}
            title="Cerrar"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido con scroll */}
        <div className={`p-6 sm:p-8 overflow-y-auto space-y-6 text-sm leading-relaxed ${
          isDarkMode ? "text-gray-300" : "text-gray-700"
        }`}>
          <section>
            <h3 className={`font-bold text-base mb-2 ${isDarkMode ? "text-emerald-400" : "text-emerald-700"}`}>
              1. Aceptación de los términos y condiciones
            </h3>
            <p>
              El acceso, registro y uso de la plataforma EcoRuteando implica que el usuario ha leído y acepta los presentes Términos y Condiciones. Si el usuario no está de acuerdo con alguna de sus disposiciones, deberá abstenerse de utilizar los servicios que ofrece la plataforma.
            </p>
            <p className="mt-2">
              Estos términos establecen las condiciones generales de acceso, uso y responsabilidad relacionadas con EcoRuteando.
            </p>
          </section>

          <section>
            <h3 className={`font-bold text-base mb-2 ${isDarkMode ? "text-emerald-400" : "text-emerald-700"}`}>
              2. Descripción del servicio
            </h3>
            <p>
              EcoRuteando es una plataforma de movilidad sostenible desarrollada en el marco del programa de formación en Desarrollo de Software del Servicio Nacional de Aprendizaje (SENA).
            </p>
            <p className="mt-2">
              Su propósito es facilitar la planificación de desplazamientos y promover prácticas de movilidad consciente mediante funcionalidades como:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 pl-2">
              <li>Planificación de rutas para desplazamientos en automóvil particular y a pie.</li>
              <li>Visualización de mapas y puntos de interés disponibles en la plataforma.</li>
              <li>Consulta de información relacionada con las rutas y su impacto ambiental estimado.</li>
              <li>Gestión de la cuenta y del perfil del usuario.</li>
              <li>Registro y seguimiento de reportes relacionados con obstáculos o problemas de movilidad, según las funcionalidades habilitadas.</li>
              <li>Consulta de alertas e información relevante para la planificación de desplazamientos, cuando estén disponibles.</li>
            </ul>
            <p className="mt-2">
              Las funcionalidades pueden variar según la versión de la plataforma, el tipo de dispositivo y la disponibilidad de los servicios integrados.
            </p>
          </section>

          <section>
            <h3 className={`font-bold text-base mb-2 ${isDarkMode ? "text-emerald-400" : "text-emerald-700"}`}>
              3. Registro y cuenta de usuario
            </h3>
            <p>
              Para acceder a las funcionalidades que requieren autenticación, el usuario deberá proporcionar información veraz, completa y actualizada.
            </p>
            <p className="mt-2">El usuario se compromete a:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 pl-2">
              <li>Mantener la confidencialidad de sus credenciales de acceso.</li>
              <li>No compartir su cuenta ni permitir su utilización indebida por terceros.</li>
              <li>Actualizar la información de su perfil cuando sea necesario.</li>
              <li>Informar, por los canales de contacto habilitados, sobre cualquier acceso no autorizado o actividad sospechosa relacionada con su cuenta.</li>
              <li>No suplantar la identidad de otras personas ni registrar cuentas utilizando información ajena sin autorización.</li>
            </ul>
            <p className="mt-2">
              El usuario será responsable de las actividades realizadas desde su cuenta, sin perjuicio de las responsabilidades que legalmente correspondan a EcoRuteando o a terceros.
            </p>
            <p className="mt-2">
              EcoRuteando podrá adoptar medidas de seguridad o restringir temporalmente el acceso cuando existan indicios razonables de uso fraudulento, suplantación o incumplimiento de estos términos, respetando los derechos del usuario y la normativa aplicable.
            </p>
          </section>

          <section>
            <h3 className={`font-bold text-base mb-2 ${isDarkMode ? "text-emerald-400" : "text-emerald-700"}`}>
              4. Uso aceptable de la plataforma
            </h3>
            <p>
              El usuario se compromete a utilizar EcoRuteando de manera lícita, responsable y respetuosa.
            </p>
            <p className="mt-2">Se prohíbe expresamente:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 pl-2">
              <li>Publicar, transmitir o registrar contenido amenazante, discriminatorio, difamatorio, abusivo u ofensivo que vulnere los derechos de otras personas.</li>
              <li>Utilizar la plataforma para cometer, facilitar o promover actividades ilegales.</li>
              <li>Introducir código malicioso, virus o cualquier elemento que pueda comprometer la seguridad o el funcionamiento del sistema.</li>
              <li>Intentar acceder sin autorización a cuentas, datos, servicios o componentes internos de la plataforma.</li>
              <li>Alterar, interferir o sobrecargar deliberadamente los servicios.</li>
              <li>Manipular los reportes, las ubicaciones u otros datos con el propósito de engañar a otros usuarios o afectar el funcionamiento de EcoRuteando.</li>
              <li>Utilizar herramientas automatizadas para extraer información o realizar solicitudes abusivas que afecten la disponibilidad del servicio.</li>
              <li>Vulnerar los derechos de propiedad intelectual de EcoRuteando o de terceros.</li>
            </ul>
            <p className="mt-2">
              El incumplimiento de estas disposiciones podrá dar lugar a medidas proporcionales, como la revisión de la actividad, la restricción temporal de funcionalidades o la suspensión de la cuenta, según la gravedad de los hechos y la legislación aplicable.
            </p>
          </section>

          <section>
            <h3 className={`font-bold text-base mb-2 ${isDarkMode ? "text-emerald-400" : "text-emerald-700"}`}>
              5. Ubicación, mapas y planificación de rutas
            </h3>
            <p>
              Algunas funcionalidades de EcoRuteando pueden requerir acceso a la ubicación del dispositivo o el ingreso manual de un punto de origen y un destino.
            </p>
            <p className="mt-2">
              El usuario podrá gestionar los permisos de ubicación desde la configuración de su dispositivo. La disponibilidad y precisión de esta información dependerán, entre otros factores, del dispositivo, la conexión, los servicios cartográficos y las fuentes de datos utilizadas.
            </p>
            <p className="mt-2">
              Las rutas, distancias, tiempos estimados y demás resultados proporcionados por la plataforma tienen carácter orientativo. Pueden cambiar por condiciones del entorno, restricciones de circulación, errores cartográficos, cierres viales u otras circunstancias.
            </p>
            <p className="mt-2">
              El usuario deberá verificar las condiciones reales del recorrido, respetar las señales de tránsito y las normas aplicables, y tomar decisiones de desplazamiento de manera responsable. EcoRuteando no sustituye las señales oficiales, las indicaciones de las autoridades ni el criterio del usuario.
            </p>
          </section>

          <section>
            <h3 className={`font-bold text-base mb-2 ${isDarkMode ? "text-emerald-400" : "text-emerald-700"}`}>
              6. Información ambiental y estimaciones de CO₂
            </h3>
            <p>
              EcoRuteando puede proporcionar estimaciones de emisiones de dióxido de carbono (CO₂) y de posibles emisiones evitadas asociadas a determinados desplazamientos.
            </p>
            <p className="mt-2">
              Estas estimaciones se calculan a partir de los datos disponibles y de los factores o supuestos definidos por la plataforma. Por lo tanto, representan aproximaciones y no mediciones directas de las emisiones reales de cada usuario.
            </p>
            <p className="mt-2">
              Los resultados pueden variar según la distancia recorrida, el medio de transporte, los factores de cálculo utilizados y la calidad de la información disponible. No deben interpretarse como certificaciones ambientales ni como garantías de reducción efectiva de emisiones.
            </p>
          </section>

          <section>
            <h3 className={`font-bold text-base mb-2 ${isDarkMode ? "text-emerald-400" : "text-emerald-700"}`}>
              7. Reportes ciudadanos y contenido aportado por usuarios
            </h3>
            <p>
              Cuando la plataforma permita registrar reportes sobre obstáculos, incidentes o problemas de movilidad, el usuario deberá procurar que la información proporcionada sea veraz, pertinente y respetuosa de los derechos de terceros.
            </p>
            <p className="mt-2">
              Los reportes deberán corresponder a situaciones reales y no podrán utilizarse para difundir información deliberadamente falsa, realizar acusaciones infundadas, acosar a otras personas o divulgar datos personales sin autorización o fundamento legal.
            </p>
            <p className="mt-2">
              EcoRuteando podrá revisar, moderar, ocultar o rechazar reportes que incumplan estos términos, así como solicitar información adicional cuando resulte necesario y técnicamente posible.
            </p>
            <p className="mt-2 font-medium">
              El envío de un reporte no garantiza que la situación sea verificada, corregida o atendida por una autoridad o entidad competente. Los reportes no sustituyen los canales oficiales de emergencia.
            </p>
          </section>

          <section>
            <h3 className={`font-bold text-base mb-2 ${isDarkMode ? "text-emerald-400" : "text-emerald-700"}`}>
              8. Protección de datos personales y privacidad
            </h3>
            <p>
              EcoRuteando tratará los datos personales de acuerdo con la legislación colombiana aplicable, en particular la Ley 1581 de 2012 y sus normas reglamentarias y complementarias.
            </p>
            <p className="mt-2">
              Los datos se tratarán para las finalidades informadas al usuario, que podrán incluir la creación y administración de cuentas, la prestación de las funcionalidades solicitadas, la planificación de rutas, la gestión de reportes, la seguridad de la plataforma y la atención de solicitudes.
            </p>
            <p className="mt-2">
              El usuario podrá ejercer los derechos que le reconozca la normativa aplicable, incluidos los de conocer, actualizar y rectificar sus datos personales, solicitar prueba de la autorización cuando corresponda y presentar consultas o reclamos ante el responsable del tratamiento.
            </p>
          </section>

          <section>
            <h3 className={`font-bold text-base mb-2 ${isDarkMode ? "text-emerald-400" : "text-emerald-700"}`}>
              9. Servicios de terceros
            </h3>
            <p>
              EcoRuteando puede utilizar servicios externos para ofrecer determinadas funcionalidades, como mapas, geolocalización, autenticación, alojamiento de infraestructura o envío de notificaciones. El funcionamiento de estas funcionalidades puede depender de la disponibilidad y condiciones de los proveedores.
            </p>
          </section>

          <section>
            <h3 className={`font-bold text-base mb-2 ${isDarkMode ? "text-emerald-400" : "text-emerald-700"}`}>
              10. Disponibilidad y mantenimiento del servicio
            </h3>
            <p>
              EcoRuteando procurará mantener la plataforma disponible y operativa. Sin embargo, no garantiza que el servicio funcione de manera ininterrumpida o que esté libre de errores. Podrán presentarse interrupciones por mantenimiento, actualizaciones o circunstancias ajenas al control.
            </p>
          </section>

          <section>
            <h3 className={`font-bold text-base mb-2 ${isDarkMode ? "text-emerald-400" : "text-emerald-700"}`}>
              11. Propiedad intelectual
            </h3>
            <p>
              Los elementos propios de EcoRuteando, incluidos su código fuente, diseño, interfaz, identidad gráfica, documentación y demás componentes protegidos, estarán sujetos a los derechos de propiedad intelectual correspondientes. Queda prohibida la reproducción o explotación no autorizada.
            </p>
          </section>

          <section>
            <h3 className={`font-bold text-base mb-2 ${isDarkMode ? "text-emerald-400" : "text-emerald-700"}`}>
              12. Limitación de responsabilidad
            </h3>
            <p>
              En la medida permitida por la legislación aplicable, EcoRuteando no garantiza la exactitud absoluta de las rutas, ubicaciones, tiempos de desplazamiento, alertas, reportes ni estimaciones ambientales generadas. El usuario es responsable de verificar las condiciones reales del entorno.
            </p>
          </section>

          <section>
            <h3 className={`font-bold text-base mb-2 ${isDarkMode ? "text-emerald-400" : "text-emerald-700"}`}>
              13. Suspensión y terminación de la cuenta
            </h3>
            <p>
              El usuario podrá solicitar la eliminación de su cuenta en cualquier momento. EcoRuteando podrá restringir o suspender una cuenta ante indicios razonables de fraude, uso ilícito o incumplimiento de estos términos.
            </p>
          </section>

          <section>
            <h3 className={`font-bold text-base mb-2 ${isDarkMode ? "text-emerald-400" : "text-emerald-700"}`}>
              14. Modificaciones de los términos
            </h3>
            <p>
              EcoRuteando podrá actualizar estos Términos y Condiciones para reflejar cambios funcionales, técnicos o normativos, comunicándolos por medios razonables.
            </p>
          </section>

          <section>
            <h3 className={`font-bold text-base mb-2 ${isDarkMode ? "text-emerald-400" : "text-emerald-700"}`}>
              15. Legislación aplicable
            </h3>
            <p>
              Estos Términos y Condiciones se interpretarán conforme a las leyes de la República de Colombia. Las controversias se tramitarán ante las autoridades competentes.
            </p>
          </section>

          <section>
            <h3 className={`font-bold text-base mb-2 ${isDarkMode ? "text-emerald-400" : "text-emerald-700"}`}>
              16. Contacto
            </h3>
            <p>
              Para presentar consultas, solicitudes o reportes relacionados con estos Términos y Condiciones, el usuario podrá utilizar los canales de contacto oficiales o la sección de soporte técnico de la plataforma.
            </p>
          </section>
        </div>

        {/* Pie con acciones */}
        <div className={`p-4 sm:p-6 border-t flex flex-col sm:flex-row gap-3 justify-end shrink-0 ${
          isDarkMode ? "border-[#26383D] bg-[#162329]/50" : "border-gray-100 bg-gray-50/50"
        }`}>
          <button
            type="button"
            onClick={onClose}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
              isDarkMode ? "border-[#26383D] hover:bg-[#162329] text-gray-300" : "border-gray-200 hover:bg-gray-100 text-gray-700"
            }`}
          >
            Cerrar
          </button>
          {showAcceptButton && onAccept && (
            <button
              type="button"
              onClick={onAccept}
              className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md transition-all active:scale-95"
            >
              Acepto los términos y condiciones
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
