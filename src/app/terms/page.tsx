"use client";

import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
          alt="Jurid Voice Logo"
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
          <p className="text-lg text-gray-600">Jurid Voice</p>
          <p className="mt-2 text-sm text-gray-500">
            Última atualização: 20 de abril de 2026
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
            {/* Introdução */}
            <section className="space-y-4">
              <p className="leading-relaxed text-gray-700">
                Bem-vindo(a) ao <strong>Jurid Voice</strong>, uma ferramenta
                projetada para auxiliar na sua produtividade e organização
                pessoal e profissional. Ao instalar, acessar ou utilizar o{" "}
                <strong>Jurid Voice</strong>, você concorda em cumprir e estar
                vinculado(a) aos Termos de Uso aqui apresentados. Caso não
                concorde com estes Termos, por favor, não instale ou utilize o{" "}
                <strong>Jurid Voice</strong>.
              </p>
            </section>

            {/* Section 1 */}
            <section className="space-y-4 border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-[#AB8E63] md:text-3xl">
                1. Aceitação dos Termos
              </h2>
              <p className="leading-relaxed text-gray-700">
                Estes Termos de Uso constituem um acordo legal entre você, o
                usuário final, e a <strong>Executivos Digital Software House</strong>,
                doravante denominada &quot;Nós&quot; ou &quot;Desenvolvedora&quot;. Ao utilizar
                o <strong>Jurid Voice</strong>, você declara ter lido, compreendido e
                aceitado integralmente estes Termos, bem como nossa{" "}
                <Link
                  href="/privacy"
                  className="font-semibold text-[#AB8E63] underline hover:text-[#8f7750]"
                >
                  Política de Privacidade
                </Link>
                .
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-4 border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-[#AB8E63] md:text-3xl">
                2. Descrição do Serviço
              </h2>
              <p className="leading-relaxed text-gray-700">
                O <strong>Jurid Voice</strong> oferece funcionalidades para gravação
                de áudio e/ou vídeo (tela), armazenando as informações
                localmente em seu próprio dispositivo. O principal objetivo é
                permitir que você capture suas próprias interações online para
                revisão pessoal, anotações e outras finalidades de uso
                individual e não comercial. A plataforma foi desenvolvida com
                foco na privacidade e segurança dos seus dados, conforme
                detalhado em nossa{" "}
                <Link
                  href="/privacy"
                  className="font-semibold text-[#AB8E63] underline hover:text-[#8f7750]"
                >
                  Política de Privacidade
                </Link>
                .
              </p>
            </section>

            {/* Section 3 */}
            <section className="space-y-4 border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-[#AB8E63] md:text-3xl">
                3. Licença de Uso
              </h2>
              <p className="leading-relaxed text-gray-700">
                Concedemos a você uma licença limitada, não exclusiva, não
                transferível e revogável para instalar e usar o{" "}
                <strong>Jurid Voice</strong>, estritamente para seu uso pessoal e
                não comercial, de acordo com estes Termos de Uso. Esta licença
                não concede a você nenhum direito de propriedade intelectual
                sobre o <strong>Jurid Voice</strong> ou qualquer de seus
                componentes.
              </p>
            </section>

            {/* Section 4 */}
            <section className="space-y-4 border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-[#AB8E63] md:text-3xl">
                4. Restrições de Uso
              </h2>
              <p className="leading-relaxed text-gray-700">
                Ao utilizar o <strong>Jurid Voice</strong>, você concorda em não:
              </p>
              <ul className="ml-6 list-disc space-y-2 text-gray-700">
                <li>
                  Usar o <strong>Jurid Voice</strong> para qualquer finalidade
                  ilegal ou não autorizada.
                </li>
                <li>
                  Violar leis, regulamentos ou direitos de terceiros, incluindo,
                  mas não se limitando a, direitos autorais, direitos de imagem
                  e privacidade.
                </li>
                <li>
                  Gravar ou capturar informações de terceiros sem o
                  consentimento explícito e adequado destes. Você é o único
                  responsável pela obtenção de quaisquer permissões necessárias
                  para gravar dados de terceiros, se aplicável, e por garantir
                  que seu uso da plataforma esteja em conformidade com todas as
                  leis e regulamentos aplicáveis.
                </li>
                <li>
                  Modificar, adaptar, traduzir, fazer engenharia reversa,
                  descompilar, desmontar ou tentar descobrir o código-fonte do{" "}
                  <strong>Jurid Voice</strong>.
                </li>
                <li>
                  Remover, ocultar ou alterar quaisquer avisos de direitos
                  autorais, marcas registradas ou outros avisos de propriedade
                  contidos no <strong>Jurid Voice</strong>.
                </li>
                <li>
                  Distribuir, vender, sublicenciar ou de outra forma transferir
                  o <strong>Jurid Voice</strong> ou seus direitos de uso a
                  terceiros.
                </li>
                <li>
                  Utilizar o <strong>Jurid Voice</strong> de forma que possa
                  danificar, desabilitar, sobrecarregar ou prejudicar qualquer
                  servidor ou rede associada aos serviços da Desenvolvedora.
                </li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="space-y-4 border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-[#AB8E63] md:text-3xl">
                5. Propriedade Intelectual
              </h2>
              <p className="leading-relaxed text-gray-700">
                Todos os direitos autorais, marcas registradas e outros direitos
                de propriedade intelectual do <strong>Jurid Voice</strong>{" "}
                (incluindo seu código-fonte, design, interface de usuário e
                funcionalidades) são de propriedade exclusiva da{" "}
                <strong>Executivos Digital Software House</strong> ou de seus
                licenciadores. Estes Termos de Uso não lhe concedem nenhum
                direito ou interesse sobre a propriedade intelectual do{" "}
                <strong>Jurid Voice</strong>, exceto a licença de uso limitada
                explicitamente concedida no item 3.
              </p>
            </section>

            {/* Section 6 */}
            <section className="space-y-4 border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-[#AB8E63] md:text-3xl">
                6. Isenção de Garantias
              </h2>
              <p className="leading-relaxed text-gray-700">
                O <strong>Jurid Voice</strong> é fornecido &quot;como está&quot; e &quot;conforme
                disponível&quot;, sem garantias de qualquer tipo, expressas ou
                implícitas. A Desenvolvedora não garante que o{" "}
                <strong>Jurid Voice</strong> será ininterrupto, livre de erros,
                seguro ou que qualquer defeito será corrigido. Embora nos
                esforcemos para garantir a segurança e a funcionalidade, o uso
                do <strong>Jurid Voice</strong> é por sua conta e risco.
              </p>
            </section>

            {/* Section 7 */}
            <section className="space-y-4 border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-[#AB8E63] md:text-3xl">
                7. Limitação de Responsabilidade
              </h2>
              <p className="leading-relaxed text-gray-700">
                Na extensão máxima permitida pela lei aplicável, a
                Desenvolvedora não será responsável por quaisquer danos
                diretos, indiretos, incidentais, especiais, consequenciais ou
                exemplares, incluindo, mas não se limitando a, danos por perda
                de lucros, dados ou outras perdas intangíveis, resultantes do
                uso ou da incapacidade de usar o <strong>Jurid Voice</strong>.
              </p>
            </section>

            {/* Section 8 */}
            <section className="space-y-4 border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-[#AB8E63] md:text-3xl">
                8. Indenização
              </h2>
              <p className="leading-relaxed text-gray-700">
                Você concorda em indenizar e isentar a Desenvolvedora, seus
                diretores, funcionários e agentes de qualquer e toda
                reivindicação, responsabilidade, dano, perda e despesa
                (incluindo honorários advocatícios) decorrentes de ou
                relacionados ao seu uso do <strong>Jurid Voice</strong> em
                violação a estes Termos de Uso ou em violação a quaisquer leis
                ou regulamentos aplicáveis.
              </p>
            </section>

            {/* Section 9 */}
            <section className="space-y-4 border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-[#AB8E63] md:text-3xl">
                9. Modificações dos Termos
              </h2>
              <p className="leading-relaxed text-gray-700">
                A Desenvolvedora reserva-se o direito de modificar estes Termos
                de Uso a qualquer momento, a seu exclusivo critério. Quaisquer
                alterações entrarão em vigor imediatamente após a sua
                publicação no site oficial do <strong>Jurid Voice</strong>{" "}
                (
                <a
                  href="https://voice.juridia.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#AB8E63] underline hover:text-[#8f7750]"
                >
                  https://voice.juridia.com.br
                </a>
                ). Seu uso continuado do <strong>Jurid Voice</strong> após a
                publicação das alterações constitui sua aceitação dos Termos
                modificados.
              </p>
            </section>

            {/* Section 10 */}
            <section className="space-y-4 border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-[#AB8E63] md:text-3xl">
                10. Rescisão
              </h2>
              <p className="leading-relaxed text-gray-700">
                Estes Termos de Uso permanecerão em pleno vigor e efeito
                enquanto você utilizar o <strong>Jurid Voice</strong>. A
                Desenvolvedora pode rescindir estes Termos de Uso e sua licença
                a qualquer momento, sem aviso prévio, se você violar qualquer
                disposição destes Termos. Você pode rescindir sua aceitação a
                estes Termos a qualquer momento, desinstalando ou deixando de
                utilizar o <strong>Jurid Voice</strong>.
              </p>
            </section>

            {/* Section 11 */}
            <section className="space-y-4 border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-[#AB8E63] md:text-3xl">
                11. Disposições Gerais
              </h2>
              <ul className="ml-6 list-disc space-y-3 text-gray-700">
                <li>
                  <strong>Lei Aplicável e Foro:</strong> Estes Termos de Uso
                  serão regidos e interpretados de acordo com as leis da
                  República Federativa do Brasil. Fica eleito o foro da comarca
                  de São Paulo/SP para dirimir quaisquer dúvidas ou litígios
                  decorrentes destes Termos, renunciando a qualquer outro, por
                  mais privilegiado que seja.
                </li>
                <li>
                  <strong>Integralidade do Acordo:</strong> Estes Termos de
                  Uso, juntamente com a{" "}
                  <Link
                    href="/privacy"
                    className="font-semibold text-[#AB8E63] underline hover:text-[#8f7750]"
                  >
                    Política de Privacidade
                  </Link>{" "}
                  do <strong>Jurid Voice</strong>, constituem o acordo integral
                  entre você e a Desenvolvedora em relação ao uso do{" "}
                  <strong>Jurid Voice</strong>.
                </li>
                <li>
                  <strong>Divisibilidade:</strong> Se qualquer disposição
                  destes Termos for considerada inválida ou inexequível por um
                  tribunal de jurisdição competente, as demais disposições
                  destes Termos permanecerão em pleno vigor e efeito.
                </li>
              </ul>
            </section>

            {/* Section 12 */}
            <section className="space-y-4 border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-[#AB8E63] md:text-3xl">
                12. Contato
              </h2>
              <p className="leading-relaxed text-gray-700">
                Para quaisquer dúvidas ou preocupações relacionadas a estes
                Termos de Uso, entre em contato conosco através dos seguintes
                canais:
              </p>
              <ul className="ml-6 list-disc space-y-2 text-gray-700">
                <li>
                  <strong>E-mail:</strong>{" "}
                  <a
                    href="mailto:suporte@executivosdigital.com.br"
                    className="font-semibold text-[#AB8E63] underline hover:text-[#8f7750]"
                  >
                    suporte@executivosdigital.com.br
                  </a>
                </li>
                <li>
                  <strong>Website:</strong>{" "}
                  <a
                    href="https://voice.juridia.com.br"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#AB8E63] underline hover:text-[#8f7750]"
                  >
                    https://voice.juridia.com.br
                  </a>
                </li>
              </ul>
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
          <p>Última atualização: 20 de abril de 2026</p>
        </motion.div>
      </div>
    </div>
  );
}
