import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CaretDown, CaretUp, Plus, X } from "phosphor-react";

export const Route = createFileRoute(
  "/(dashboard)/_side-nav-dashboard/(perfis)/influenciador/$username/editar/"
)({
  component: InfluencerEditProfilePage,
});

function InfluencerEditProfilePage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <Section
        title="Dados básicos"
        initiallyOpen
        content={<BasicDataSection />}
      />
      <Section title="Sobre você" content={<AboutSection />} />
      <Section title="Endereço" content={<AddressSection />} />
      <Section title="Redes sociais" content={<SocialMediaSection />} />
      <Section title="Mídia kit" content={<MediaKitSection />} />
      <Section title="Conta bancária" content={<BankAccountSection />} />
      <Section title="Portfólio" content={<PortfolioSection />} />
      <Section title="Habilidades" content={<SkillsSection />} />
      <Section title="Informações da Conta" content={<AccountInfoSection />} />
    </div>
  );
}

interface SectionProps {
  title: string;
  content: React.ReactNode;
  initiallyOpen?: boolean;
}

function Section({ title, content, initiallyOpen = false }: SectionProps) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);

  return (
    <div className="bg-white rounded-lg overflow-hidden border-2">
      <div
        className="flex justify-between items-center cursor-pointer bg-gray-100 px-5 py-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-lg font-bold">{title}</h2>

        {isOpen ? (
          <CaretUp size={22} color="#333" />
        ) : (
          <CaretDown size={22} color="#333" />
        )}
      </div>

      {isOpen && <div className="mt-4 space-y-6 px-5 pb-5">{content}</div>}
    </div>
  );
}

function BasicDataSection() {
  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Foto de fundo*
          </label>
          <img
            src="https://via.placeholder.com/600"
            alt="Cover"
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <input
            type="file"
            className="border border-gray-300 p-2 rounded-lg w-full"
          />
        </div>
        <div className="flex flex-col items-center">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Carregar nova imagem de perfil
          </label>
          <img
            src="https://via.placeholder.com/80"
            alt="Profile"
            className="w-20 h-20 rounded-full border-2 border-gray-300"
          />
          <input
            type="file"
            className="border border-gray-300 p-2 rounded-lg mt-4"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bio*
        </label>
        <textarea
          className="border border-gray-300 p-2 rounded-lg w-full"
          rows={3}
          placeholder="Escreva uma breve descrição sobre você"
        />
      </div>
      <button className="bg-blue-600 text-white py-2 px-4 rounded-lg">
        Salvar Alterações
      </button>
    </>
  );
}

function AboutSection() {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nome Completo*
        </label>
        <input
          type="text"
          className="border border-gray-300 p-2 rounded-lg w-full"
          placeholder="Nome completo"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Data de Nascimento*
        </label>
        <input
          type="date"
          className="border border-gray-300 p-2 rounded-lg w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email*
        </label>
        <input
          type="email"
          className="border border-gray-300 p-2 rounded-lg w-full"
          placeholder="email@exemplo.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          WhatsApp*
        </label>
        <input
          type="tel"
          className="border border-gray-300 p-2 rounded-lg w-full"
          placeholder="+55 35 99988-1234"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo de Conta*
        </label>
        <select className="border border-gray-300 p-2 rounded-lg w-full">
          <option value="">Selecione o tipo de conta</option>
          <option value="ugc">UGC (Talentos)</option>
          <option value="influencer">Influencers</option>
          <option value="ugc-influencer">UGC + Influencer</option>
        </select>
        <p className="text-gray-500 text-sm mt-1">
          UGC (Talentos): Você cria vídeos ou fotos que serão entregues para as
          marcas utilizarem em suas campanhas, anúncios ou redes sociais.
          Influencers: Você cria e compartilha o conteúdo diretamente nas suas
          redes sociais, promovendo produtos e serviços para seu público. UGC +
          Influencer: Você tanto cria o conteúdo para as marcas quanto
          compartilha nas suas próprias redes sociais.
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gênero*
        </label>
        <select className="border border-gray-300 p-2 rounded-lg w-full">
          <option value="">Selecione o seu gênero</option>
          <option value="feminino">Feminino</option>
          <option value="masculino">Masculino</option>
          <option value="nao-binario">Não Binário</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nicho*
        </label>
        <select className="border border-gray-300 p-2 rounded-lg w-full">
          <option value="">Selecione seu nicho de atuação</option>
          <option value="eletronicos">Eletrônicos & Apps</option>
          <option value="entretenimento">Entretenimento</option>
          <option value="fitness">Fitness</option>
          <option value="lifestyle">Lifestyle</option>
          <option value="viagem">Viagem</option>
          <option value="pets">Pets</option>
        </select>
      </div>
      <button className="bg-blue-600 text-white py-2 px-4 rounded-lg">
        Salvar Alterações
      </button>
    </>
  );
}

function AddressSection() {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            País*
          </label>
          <input
            type="text"
            className="border border-gray-300 p-2 rounded-lg w-full"
            placeholder="Selecione seu país"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CEP*
          </label>
          <input
            type="text"
            className="border border-gray-300 p-2 rounded-lg w-full"
            placeholder="Digite seu CEP"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rua
          </label>
          <input
            type="text"
            className="border border-gray-300 p-2 rounded-lg w-full"
            placeholder="Digite o nome da sua rua"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número
          </label>
          <input
            type="text"
            className="border border-gray-300 p-2 rounded-lg w-full"
            placeholder="Digite o número da sua residência"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Complemento
          </label>
          <input
            type="text"
            className="border border-gray-300 p-2 rounded-lg w-full"
            placeholder="Digite o complemento (opcional)"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bairro
          </label>
          <input
            type="text"
            className="border border-gray-300 p-2 rounded-lg w-full"
            placeholder="Digite o nome do seu bairro"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cidade*
          </label>
          <input
            type="text"
            className="border border-gray-300 p-2 rounded-lg w-full"
            placeholder="Digite o nome da sua cidade"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado*
          </label>
          <input
            type="text"
            className="border border-gray-300 p-2 rounded-lg w-full"
            placeholder="Selecione seu estado"
          />
        </div>
      </div>
      <button className="bg-blue-600 text-white py-2 px-4 rounded-lg">
        Salvar Alterações
      </button>
    </>
  );
}

function SocialMediaSection() {
  return (
    <>
      <p className="text-gray-500 text-sm mb-4">
        Preencha pelo menos uma rede social. Todas as redes sociais são
        opcionais, mas é necessário que ao menos um campo esteja preenchido.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Instagram
          </label>
          <input
            type="url"
            className="border border-gray-300 p-2 rounded-lg w-full"
            placeholder="Insira o URL do seu perfil"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número de seguidores
          </label>
          <input
            type="number"
            className="border border-gray-300 p-2 rounded-lg w-full"
            placeholder="Número de seguidores"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Youtube
          </label>
          <input
            type="url"
            className="border border-gray-300 p-2 rounded-lg w-full"
            placeholder="Insira o URL do seu perfil"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número de seguidores
          </label>
          <input
            type="number"
            className="border border-gray-300 p-2 rounded-lg w-full"
            placeholder="Número de seguidores"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            TikTok
          </label>
          <input
            type="url"
            className="border border-gray-300 p-2 rounded-lg w-full"
            placeholder="Insira o URL do seu perfil"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número de seguidores
          </label>
          <input
            type="number"
            className="border border-gray-300 p-2 rounded-lg w-full"
            placeholder="Número de seguidores"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pinterest
          </label>
          <input
            type="url"
            className="border border-gray-300 p-2 rounded-lg w-full"
            placeholder="Insira o URL do seu perfil"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número de seguidores
          </label>
          <input
            type="number"
            className="border border-gray-300 p-2 rounded-lg w-full"
            placeholder="Número de seguidores"
          />
        </div>
      </div>
      <button className="bg-blue-600 text-white py-2 px-4 rounded-lg">
        Salvar Alterações
      </button>
    </>
  );
}

function MediaKitSection() {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mídia Kit
        </label>
        <input
          type="url"
          className="border border-gray-300 p-2 rounded-lg w-full"
          placeholder="Insira o URL do seu mídia kit"
        />
      </div>
      <button className="bg-blue-600 text-white py-2 px-4 rounded-lg">
        Salvar Alterações
      </button>
    </>
  );
}

function BankAccountSection() {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Chave Pix*
        </label>
        <input
          type="text"
          className="border border-gray-300 p-2 rounded-lg w-full"
          placeholder="Insira sua chave Pix"
        />
      </div>
      <button className="bg-blue-600 text-white py-2 px-4 rounded-lg">
        Salvar Alterações
      </button>
    </>
  );
}

function PortfolioSection() {
  return (
    <div className="space-y-8">
      <FAQSection />
      <BrandsSection />
      <PreviousWorksSection />
      <button className="bg-blue-600 text-white py-2 px-4 rounded-lg mt-4">
        Salvar Alterações
      </button>
    </div>
  );
}

function FAQSection() {
  const [faqItems, setFaqItems] = useState([{ question: "", answer: "" }]);

  const addFAQ = () => {
    if (faqItems.length < 10) {
      setFaqItems([...faqItems, { question: "", answer: "" }]);
    }
  };

  const removeFAQ = (index: number) => {
    if (faqItems.length > 1) {
      setFaqItems(faqItems.filter((_, i) => i !== index));
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Perguntas Frequentes</h3>
      <p className="text-sm text-gray-500 mb-4">
        Você pode adicionar quantas perguntas desejar. Uma vez adicionada, a
        pergunta e a resposta devem ser preenchidas ou removidas antes de
        atualizar o perfil.
      </p>
      {faqItems.map((item, index) => (
        <div key={index} className="space-y-2 mb-4">
          <div className="flex items-center">
            <input
              type="text"
              placeholder={`Pergunta #${index + 1}`}
              className="border border-gray-300 rounded-lg p-2 w-full"
              value={item.question}
              onChange={(e) =>
                setFaqItems(
                  faqItems.map((faq, i) =>
                    i === index ? { ...faq, question: e.target.value } : faq
                  )
                )
              }
            />
            <button
              onClick={() => removeFAQ(index)}
              className="ml-2 text-red-500"
            >
              <X size={20} />
            </button>
          </div>
          <textarea
            placeholder={`Resposta #${index + 1}`}
            className="border border-gray-300 rounded-lg p-2 w-full"
            rows={3}
            value={item.answer}
            onChange={(e) =>
              setFaqItems(
                faqItems.map((faq, i) =>
                  i === index ? { ...faq, answer: e.target.value } : faq
                )
              )
            }
          />
        </div>
      ))}
      <button onClick={addFAQ} className="flex items-center text-blue-600 mt-4">
        <Plus size={20} className="mr-2" /> Adicionar pergunta
      </button>
    </div>
  );
}

function BrandsSection() {
  const [brandLogos, setBrandLogos] = useState([
    "https://via.placeholder.com/100",
  ]);

  const addBrandLogo = () => {
    if (brandLogos.length < 10) {
      setBrandLogos([...brandLogos, "https://via.placeholder.com/100"]);
    }
  };

  const removeBrandLogo = (index: number) => {
    setBrandLogos(brandLogos.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">
        Marcas que já trabalhei com
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Faça upload dos logos das marcas com as quais você já trabalhou. Tamanho
        recomendado: 500x500px.
      </p>
      <div className="flex flex-wrap gap-4">
        {brandLogos.map((logo, index) => (
          <div key={index} className="relative">
            <img
              src={logo}
              alt="Brand Logo"
              className="w-20 h-20 rounded-lg object-cover"
            />
            <button
              onClick={() => removeBrandLogo(index)}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
            >
              <X size={16} />
            </button>
          </div>
        ))}
        <button
          onClick={addBrandLogo}
          className="w-20 h-20 bg-gray-100 flex items-center justify-center rounded-lg text-blue-600"
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
}

function PreviousWorksSection() {
  const [workImages, setWorkImages] = useState([
    "https://via.placeholder.com/200",
    "https://via.placeholder.com/200",
  ]);

  const addWorkImage = () => {
    if (workImages.length < 8) {
      setWorkImages([...workImages, "https://via.placeholder.com/200"]);
    }
  };

  const removeWorkImage = (index: number) => {
    setWorkImages(workImages.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Trabalhos anteriores</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {workImages.map((image, index) => (
          <div key={index} className="relative">
            <img
              src={image}
              alt="Work"
              className="w-full h-32 object-cover rounded-lg"
            />
            <button
              onClick={() => removeWorkImage(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
            >
              <X size={16} />
            </button>
          </div>
        ))}
        <button
          onClick={addWorkImage}
          className="w-full h-32 bg-gray-100 flex items-center justify-center rounded-lg text-blue-600"
        >
          <Plus size={24} />
        </button>
      </div>
    </div>
  );
}

function SkillsSection() {
  const [languages, setLanguages] = useState(["Inglês", "Português"]);
  const [languageInput, setLanguageInput] = useState("");
  const [skills, setSkills] = useState([
    { name: "Edição de Vídeo Avançada", rating: 10 },
    { name: "Fotografia Profissional", rating: 9 },
    { name: "Gestão de Redes Sociais", rating: 10 },
  ]);
  const [skillInput, setSkillInput] = useState("");
  const [ratingInput, setRatingInput] = useState("");

  const addLanguage = () => {
    if (languageInput && !languages.includes(languageInput)) {
      setLanguages([...languages, languageInput]);
      setLanguageInput("");
    }
  };

  const removeLanguage = (index: number) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  const addSkill = () => {
    if (skillInput && ratingInput) {
      setSkills([
        ...skills,
        { name: skillInput, rating: parseInt(ratingInput) },
      ]);
      setSkillInput("");
      setRatingInput("");
    }
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Idiomas
        </label>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Insira os idiomas que você domina"
            value={languageInput}
            onChange={(e) => setLanguageInput(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg w-full"
          />

          <button onClick={addLanguage} className="text-blue-600">
            <Plus size={20} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {languages.map((lang, index) => (
            <div
              key={index}
              className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
            >
              {lang}
              <button
                onClick={() => removeLanguage(index)}
                className="ml-2 text-red-500"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Habilidades Extras
        </label>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Nome"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg flex-1"
          />
          <input
            type="number"
            placeholder="Nota"
            value={ratingInput}
            onChange={(e) => setRatingInput(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg w-24"
          />
          <button onClick={addSkill} className="text-blue-600">
            <Plus size={20} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="flex items-center bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm"
            >
              {skill.name} - Nota: {skill.rating}
              <button
                onClick={() => removeSkill(index)}
                className="ml-2 text-red-500"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <button className="bg-blue-600 text-white py-2 px-4 rounded-lg mt-7">
        Salvar Alterações
      </button>
    </div>
  );
}

function AccountInfoSection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Senha Atual
        </label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="border border-gray-300 p-2 rounded-lg w-full"
          placeholder="Digite sua senha atual"
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nova Senha
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="border border-gray-300 p-2 rounded-lg w-full"
          placeholder="Digite sua nova senha"
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Confirmar Nova Senha
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="border border-gray-300 p-2 rounded-lg w-full"
          placeholder="Confirme sua nova senha"
        />
      </div>

      <button className="bg-blue-600 text-white py-2 px-4 rounded-lg mt-4">
        Salvar Alterações
      </button>
    </div>
  );
}
