"use client";

import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Privacy() {
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
            Política de Privacidade
          </h1>
          <p className="text-lg text-gray-600">Jurid Voice</p>
          <p className="mt-2 text-sm text-gray-500">
            Última atualização: 20 de abril de 2026
          </p>
        </motion.div>

        {/* Privacy Content */}
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
                Nós, da <strong>Executivos Digital Software House</strong>,
                levamos a sua privacidade muito a sério. Esta Política de
                Privacidade descreve como o <strong>Jurid Voice</strong>{" "}
                coleta, utiliza, protege e gerencia as informações do usuário,
                com o compromisso de garantir que todos os dados permaneçam sob
                seu exclusivo controle e acesso.
              </p>
            </section>

            {/* Section 1 */}
            <section className="space-y-4 border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-[#AB8E63] md:text-3xl">
                1. Sobre o Jurid Voice
              </h2>
              <p className="leading-relaxed text-gray-700">
                O <strong>Jurid Voice</strong> é uma ferramenta desenvolvida
                para permitir que você grave e, posteriormente, acesse as suas
                próprias interações e atividades. O objetivo é fornecer um
                recurso de anotações e revisão pessoal, sem qualquer intenção
                de monitoramento externo ou compartilhamento de dados com
                terceiros.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-4 border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-[#AB8E63] md:text-3xl">
                2. Coleta de Informações
              </h2>
              <p className="leading-relaxed text-gray-700">
                O <strong>Jurid Voice</strong> opera com um princípio
                fundamental de privacidade do usuário.
              </p>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  Informações de Uso Pessoal e Local
                </h3>
                <p className="leading-relaxed text-gray-700">
                  A principal funcionalidade do <strong>Jurid Voice</strong>{" "}
                  envolve a gravação de áudio e/ou tela do seu próprio
                  ambiente de uso. Esta coleta é realizada somente com o seu
                  consentimento explícito e ativo a cada sessão de gravação.
                  Todas as informações capturadas (áudio, vídeo, texto ou
                  metadados de sessão) são processadas e armazenadas
                  localmente no seu dispositivo, em arquitetura que permite
                  acesso apenas ao próprio usuário.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  Dados de Uso Anônimos e Agregados (Opcional)
                </h3>
                <p className="leading-relaxed text-gray-700">
                  Para fins de aprimoramento do <strong>Jurid Voice</strong> e
                  detecção de bugs, podemos coletar dados de uso anônimos e
                  agregados que não identificam você pessoalmente. Estes dados
                  podem incluir informações sobre o desempenho da aplicação,
                  funcionalidades mais utilizadas e erros técnicos (ex.:
                  número de vezes que o <strong>Jurid Voice</strong> é aberto,
                  duração média de uso, cliques em determinados botões). Esta
                  coleta é realizada de forma a impossibilitar a sua
                  identificação e tem como único propósito a melhoria
                  contínua do serviço.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  Permissões
                </h3>
                <p className="leading-relaxed text-gray-700">
                  O <strong>Jurid Voice</strong> solicitará as permissões
                  mínimas necessárias para operar suas funcionalidades, tais
                  como:
                </p>
                <ul className="ml-6 list-disc space-y-2 text-gray-700">
                  <li>
                    Acesso a dispositivos de áudio e/ou vídeo (microfone,
                    câmera) para gravação.
                  </li>
                  <li>
                    Acesso ao conteúdo da tela ou abas ativas para gravação de
                    vídeo.
                  </li>
                  <li>
                    Acesso ao armazenamento local do navegador/dispositivo para
                    armazenar suas gravações e configurações.
                  </li>
                </ul>
                <p className="leading-relaxed text-gray-700">
                  Estas permissões são solicitadas no momento da instalação e
                  utilizadas estritamente para os propósitos descritos.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section className="space-y-4 border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-[#AB8E63] md:text-3xl">
                3. Finalidade do Uso das Informações
              </h2>
              <p className="leading-relaxed text-gray-700">
                As informações coletadas pelo <strong>Jurid Voice</strong> são
                utilizadas exclusivamente para os seguintes propósitos:
              </p>
              <ul className="ml-6 list-disc space-y-2 text-gray-700">
                <li>
                  <strong>Gravação e Armazenamento para Acesso Pessoal:</strong>{" "}
                  permitir que você grave suas interações e as armazene de
                  forma segura para acesso e revisão futura.
                </li>
                <li>
                  <strong>Aprimoramento da Experiência do Usuário:</strong>{" "}
                  utilizar dados anônimos e agregados para compreender como o{" "}
                  <strong>Jurid Voice</strong> é utilizado e como podemos
                  torná-lo mais eficiente, intuitivo e livre de erros.
                </li>
                <li>
                  <strong>Manutenção e Suporte Técnico:</strong> ajudar a
                  diagnosticar e resolver problemas técnicos.
                </li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="space-y-4 border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-[#AB8E63] md:text-3xl">
                4. Compartilhamento e Acesso de Dados
              </h2>
              <p className="leading-relaxed text-gray-700">
                Nós não vendemos, alugamos, trocamos ou compartilhamos suas
                gravações ou quaisquer dados de identificação pessoal com
                terceiros.
              </p>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  Dados Criptografados e Acesso Exclusivo
                </h3>
                <p className="leading-relaxed text-gray-700">
                  Todas as gravações e as informações geradas pelo{" "}
                  <strong>Jurid Voice</strong> são criptografadas e armazenadas
                  de forma que apenas você — o usuário — tenha acesso a elas em
                  seu próprio dispositivo. Não há servidores externos ou bancos
                  de dados sob nosso controle que armazenem suas gravações
                  pessoais. A criptografia é implementada para garantir que,
                  mesmo em caso de acesso físico ao seu dispositivo, as
                  informações não sejam facilmente decifráveis sem a sua
                  autorização.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  Situações Excepcionais (Não Aplicável a Gravações Pessoais)
                </h3>
                <p className="leading-relaxed text-gray-700">
                  O único cenário em que informações não pessoais e não
                  identificáveis (como dados de uso anônimos e agregados)
                  poderiam ser divulgadas seria:
                </p>
                <ul className="ml-6 list-disc space-y-2 text-gray-700">
                  <li>
                    Se exigido por lei ou ordem judicial válida (sempre
                    buscando proteger a privacidade do usuário ao máximo e
                    informá-lo, se legalmente permitido).
                  </li>
                  <li>
                    Para proteção de nossos direitos legais e segurança do{" "}
                    <strong>Jurid Voice</strong>, quando não envolver dados
                    pessoais do usuário.
                  </li>
                  <li>
                    Em caso de fusão, aquisição ou venda de ativos, as
                    informações anônimas e agregadas poderiam ser transferidas,
                    mantendo-se o compromisso de não identificação pessoal.
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section className="space-y-4 border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-[#AB8E63] md:text-3xl">
                5. Segurança e Armazenamento
              </h2>
              <p className="leading-relaxed text-gray-700">
                A segurança dos seus dados é primordial.
              </p>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  Armazenamento Local e Criptografia
                </h3>
                <p className="leading-relaxed text-gray-700">
                  As suas gravações são armazenadas no seu dispositivo,
                  utilizando as proteções de segurança inerentes ao ambiente
                  do navegador/sistema operacional. Adicionalmente,
                  implementamos criptografia robusta nos dados de gravação
                  antes de serem armazenados, garantindo que seu conteúdo seja
                  protegido mesmo que o arquivo local seja acessado
                  indevidamente.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  Nenhum Servidor Externo para suas Gravações
                </h3>
                <p className="leading-relaxed text-gray-700">
                  É fundamental reforçar que o <strong>Jurid Voice</strong> não
                  envia suas gravações ou qualquer dado pessoal de uso para
                  servidores externos controlados por nós ou por terceiros.
                  Todo o processamento e armazenamento das suas gravações
                  ocorre diretamente no seu dispositivo.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section className="space-y-4 border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-[#AB8E63] md:text-3xl">
                6. Seus Direitos e Controle
              </h2>
              <p className="leading-relaxed text-gray-700">
                Você possui total controle sobre suas informações e o{" "}
                <strong>Jurid Voice</strong>.
              </p>
              <ul className="ml-6 list-disc space-y-2 text-gray-700">
                <li>
                  <strong>Acesso e Gerenciamento:</strong> você pode acessar,
                  reproduzir e gerenciar suas gravações diretamente na
                  interface do <strong>Jurid Voice</strong>.
                </li>
                <li>
                  <strong>Exclusão de Dados:</strong> você pode excluir suas
                  gravações a qualquer momento através das funcionalidades do{" "}
                  <strong>Jurid Voice</strong>. A desinstalação ou remoção da
                  aplicação removerá automaticamente todas as gravações e dados
                  associados armazenados localmente.
                </li>
                <li>
                  <strong>Retirada de Consentimento:</strong> você pode revogar
                  as permissões concedidas ao <strong>Jurid Voice</strong> a
                  qualquer momento através das configurações do seu
                  navegador/sistema. A desinstalação interromperá imediatamente
                  qualquer coleta de dados e removerá os dados locais
                  associados a ela.
                </li>
              </ul>
            </section>

            {/* Section 7 */}
            <section className="space-y-4 border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-[#AB8E63] md:text-3xl">
                7. Alterações a Esta Política de Privacidade
              </h2>
              <p className="leading-relaxed text-gray-700">
                Podemos atualizar esta Política de Privacidade periodicamente
                para refletir mudanças em nossas práticas ou regulamentações
                legais. Notificaremos sobre quaisquer alterações significativas
                publicando a nova política no site oficial do{" "}
                <strong>Jurid Voice</strong> (
                <a
                  href="https://voice.juridia.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#AB8E63] underline hover:text-[#8f7750]"
                >
                  https://voice.juridia.com.br
                </a>
                ) e atualizando a data da &quot;Última atualização&quot;.
                Recomendamos que você revise esta política regularmente.
              </p>
              <p className="leading-relaxed text-gray-700">
                Esta Política deve ser lida em conjunto com os{" "}
                <Link
                  href="/terms"
                  className="font-semibold text-[#AB8E63] underline hover:text-[#8f7750]"
                >
                  Termos de Uso
                </Link>{" "}
                do <strong>Jurid Voice</strong>.
              </p>
            </section>

            {/* Section 8 */}
            <section className="space-y-4 border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-[#AB8E63] md:text-3xl">
                8. Contato
              </h2>
              <p className="leading-relaxed text-gray-700">
                Se você tiver dúvidas sobre esta Política de Privacidade ou
                sobre as práticas do <strong>Jurid Voice</strong>, entre em
                contato conosco pelos seguintes canais:
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
