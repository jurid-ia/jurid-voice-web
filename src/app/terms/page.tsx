"use client";

import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="relative flex w-full items-center justify-center bg-[#AB8E63] py-6 shadow-md">
        <button
          onClick={() => window.history.back()}
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 transition-all hover:bg-white/30"
          aria-label="Voltar"
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>
        <Image
          src="/logos/logo-dark.png"
          alt="Jurid.IA Voice Logo"
          width={1000}
          height={500}
          className="h-auto w-64 object-contain md:w-80"
          priority
        />
      </div>

      {/* Content Container */}
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 lg:px-12 xl:px-16">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">
            Termos de Uso
          </h1>
          <p className="text-lg text-gray-600">
            Jurid.IA Voice
          </p>
        </motion.div>

        {/* Terms Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="prose prose-lg max-w-none custom-scrollbar"
        >
          <div className="space-y-8 rounded-lg bg-white p-6 shadow-sm md:p-8 lg:p-10">
            {/* Section 1 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-[#AB8E63] md:text-3xl">
                1. Termos
              </h2>
              <p className="leading-relaxed text-gray-700">
                Ao acessar ao site Jurid.IA Voice, concorda em cumprir estes
                termos de serviço, todas as leis e regulamentos aplicáveis e
                concorda que é responsável pelo cumprimento de todas as leis
                locais aplicáveis. Se você não concordar com algum desses
                termos, está proibido de usar ou acessar este site. Os
                materiais contidos neste site são protegidos pelas leis de
                direitos autorais e marcas comerciais aplicáveis.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-4 border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-[#AB8E63] md:text-3xl">
                2. Uso de Licença
              </h2>
              <p className="leading-relaxed text-gray-700">
                É concedida permissão para baixar temporariamente uma cópia dos
                materiais (informações ou software) no site Jurid.IA Voice,
                apenas para visualização transitória pessoal e não comercial.
                Esta é a concessão de uma licença, não uma transferência de
                título e, sob esta licença, você não pode:
              </p>
              <ol className="ml-6 list-decimal space-y-2 text-gray-700">
                <li>modificar ou copiar os materiais;</li>
                <li>
                  usar os materiais para qualquer finalidade comercial ou para
                  exibição pública (comercial ou não comercial);
                </li>
                <li>
                  tentar descompilar ou fazer engenharia reversa de qualquer
                  software contido no site Jurid.IA Voice;
                </li>
                <li>
                  remover quaisquer direitos autorais ou outras notações de
                  propriedade dos materiais; ou
                </li>
                <li>
                  transferir os materiais para outra pessoa ou &apos;espelhe&apos;
                  os materiais em qualquer outro servidor.
                </li>
              </ol>
              <p className="leading-relaxed text-gray-700">
                Esta licença será automaticamente rescindida se você violar
                alguma dessas restrições e poderá ser rescindida por Jurid.IA
                Voice a qualquer momento. Ao encerrar a visualização desses
                materiais ou após o término desta licença, você deve apagar
                todos os materiais baixados em sua posse, seja em formato
                eletrónico ou impresso.
              </p>
            </section>

            {/* Section 3 */}
            <section className="space-y-4 border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-[#AB8E63] md:text-3xl">
                3. Isenção de responsabilidade
              </h2>
              <ol className="ml-6 list-decimal space-y-4 text-gray-700">
                <li>
                  Os materiais no site da Jurid.IA Voice são fornecidos
                  &apos;como estão&apos;. Jurid.IA Voice não oferece garantias,
                  expressas ou implícitas, e, por este meio, isenta e nega
                  todas as outras garantias, incluindo, sem limitação, garantias
                  implícitas ou condições de comercialização, adequação a um fim
                  específico ou não violação de propriedade intelectual ou outra
                  violação de direitos.
                </li>
                <li>
                  Além disso, o Jurid.IA Voice não garante ou faz qualquer
                  representação relativa à precisão, aos resultados prováveis
                  ou à confiabilidade do uso dos materiais em seu site ou de
                  outra forma relacionado a esses materiais ou em sites
                  vinculados a este site.
                </li>
              </ol>
            </section>

            {/* Section 4 */}
            <section className="space-y-4 border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-[#AB8E63] md:text-3xl">
                4. Limitações
              </h2>
              <p className="leading-relaxed text-gray-700">
                Em nenhum caso o Jurid.IA Voice ou seus fornecedores serão
                responsáveis por quaisquer danos (incluindo, sem limitação,
                danos por perda de dados ou lucro ou devido a interrupção dos
                negócios) decorrentes do uso ou da incapacidade de usar os
                materiais em Jurid.IA Voice, mesmo que Jurid.IA Voice ou um
                representante autorizado da Jurid.IA Voice tenha sido notificado
                oralmente ou por escrito da possibilidade de tais danos. Como
                algumas jurisdições não permitem limitações em garantias
                implícitas, ou limitações de responsabilidade por danos
                conseqüentes ou incidentais, essas limitações podem não se aplicar
                a você.
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-4 border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-[#AB8E63] md:text-3xl">
                5. Precisão dos materiais
              </h2>
              <p className="leading-relaxed text-gray-700">
                Os materiais exibidos no site da Jurid.IA Voice podem incluir
                erros técnicos, tipográficos ou fotográficos. Jurid.IA Voice não
                garante que qualquer material em seu site seja preciso, completo
                ou atual. Jurid.IA Voice pode fazer alterações nos materiais
                contidos em seu site a qualquer momento, sem aviso prévio. No
                entanto, Jurid.IA Voice não se compromete a atualizar os
                materiais.
              </p>
            </section>

            {/* Section 6 */}
            <section className="space-y-4 border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-[#AB8E63] md:text-3xl">
                6. Links
              </h2>
              <p className="leading-relaxed text-gray-700">
                O Jurid.IA Voice não analisou todos os sites vinculados ao seu
                site e não é responsável pelo conteúdo de nenhum site vinculado.
                A inclusão de qualquer link não implica endosso por Jurid.IA
                Voice do site. O uso de qualquer site vinculado é por conta e
                risco do usuário.
              </p>
            </section>

            {/* Section 7 - Modificações */}
            <section className="space-y-4 border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-[#AB8E63] md:text-3xl">
                Modificações
              </h2>
              <p className="leading-relaxed text-gray-700">
                O Jurid.IA Voice pode revisar estes termos de serviço do site a
                qualquer momento, sem aviso prévio. Ao usar este site, você
                concorda em ficar vinculado à versão atual desses termos de
                serviço.
              </p>
            </section>

            {/* Section 8 - Lei aplicável */}
            <section className="space-y-4 border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-[#AB8E63] md:text-3xl">
                Lei aplicável
              </h2>
              <p className="leading-relaxed text-gray-700">
                Estes termos e condições são regidos e interpretados de acordo
                com as leis do Jurid.IA Voice e você se submete irrevogavelmente
                à jurisdição exclusiva dos tribunais naquele estado ou localidade.
              </p>
            </section>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 text-center text-sm text-gray-500"
        >
          <p>
            Última atualização: {new Date().toLocaleDateString("pt-BR")}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
