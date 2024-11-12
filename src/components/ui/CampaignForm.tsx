import { Button } from "@/components/ui/button";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
	InstagramLogo,
	TiktokLogo,
	YoutubeLogo,
	PinterestLogo,
	LinkedinLogo,
	FacebookLogo,
	TwitterLogo,
	TwitchLogo,
} from "phosphor-react";
import pb from "@/lib/pb";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import { getUserData } from "@/utils/getUserData";

// options label
import {
	objectiveOptions,
	genderOptions,
	channelsOptions,
	localityOptions,
	minFollowersOptions,
	minVideoDurationOptions,
	maxVideoDurationOptions,
} from "@/utils/campaignData/labels";
import { Niche } from "@/types/Niche";
import { Campaign } from "@/types/Campaign";

const channelIcons = {
	Instagram: <InstagramLogo />,
	Tiktok: <TiktokLogo />,
	YouTube: <YoutubeLogo />,
	Pinterest: <PinterestLogo />,
	LinkedIn: <LinkedinLogo />,
	Facebook: <FacebookLogo />,
	Twitter: <TwitterLogo />,
	Twitch: <TwitchLogo />,
	YourClub: null,
	Kwai: null,
	X: <TwitterLogo />,
};

const minAgeOptions = Array.from({ length: 65 }, (_, i) => ({
	label: (i + 16).toString(),
	value: (i + 16).toString(),
}));

const maxAgeOptions = Array.from({ length: 65 }, (_, i) => ({
	label: (i + 16).toString(),
	value: (i + 16).toString(),
}));

type CampaignData = {
	basicInfo: {
		campaignName: string;
		format: string;
		coverImage: File | null;
		productUrl: string;
		campaignDetails: string;
		disseminationChannels: string[];
	};
	audienceSegmentation: {
		niche: string[];
		minAge: string;
		maxAge: string;
		gender: string;
		minFollowers: string;
		location: string;
		videoMinDuration: string;
		videoMaxDuration: string;
		paidTraffic: boolean;
		audioFormat: "Música" | "Narração";
	};
};

type CampaignBudget = {
	startDate: string;
	endDate: string;
	influencersCount: number;
	creatorFee: number;
};

type ResponsibleInfo = {
	name: string;
	email: string;
	phone: string;
	cpf: string;
};

export const CampaignForm: React.FC<CampaignFormProps> = ({
	campaignId,
	initialCampaignData,
}) => {
	const isEditMode = Boolean(campaignId);

	console.log("initialCampaignData:", initialCampaignData);
	console.log("isEditMode:", isEditMode);

	const [campaignData, setCampaignData] = useState<CampaignData>({
		basicInfo: {
			campaignName: "",
			format: "UGC",
			productUrl: "",
			coverImage: null,
			campaignDetails: "",
			disseminationChannels: [],
		},
		audienceSegmentation: {
			niche: [],
			minAge: "",
			maxAge: "",
			gender: "",
			minFollowers: "",
			location: "",
			videoMinDuration: "",
			videoMaxDuration: "",
			paidTraffic: false,
			audioFormat: "Música",
		},
	});

	const [campaignBudget, setCampaignBudget] = useState<CampaignBudget>({
		startDate: "",
		endDate: "",
		influencersCount: 0,
		creatorFee: 0,
	});

	const [responsibleInfo, setResponsibleInfo] = useState<ResponsibleInfo>({
		name: "",
		email: "",
		phone: "",
		cpf: "",
	});

	// Prefill form data in edit mode
	useEffect(() => {
		if (isEditMode && initialCampaignData) {
			setCampaignData({
				basicInfo: {
					campaignName: initialCampaignData.name || "",
					format: initialCampaignData.objective || "UGC",
					productUrl: initialCampaignData.product_url || "",
					coverImage: initialCampaignData.cover_img || null,
					campaignDetails: initialCampaignData.description || "",
					disseminationChannels: initialCampaignData.channels || [],
				},
				audienceSegmentation: {
					niche: initialCampaignData.niche || [],
					minAge: initialCampaignData.min_age || "",
					maxAge: initialCampaignData.max_age || "",
					gender: initialCampaignData.gender || "",
					minFollowers: initialCampaignData.min_followers || "",
					location: initialCampaignData.locality || "",
					videoMinDuration:
						initialCampaignData.min_video_duration || "",
					videoMaxDuration:
						initialCampaignData.max_video_duration || "",
					paidTraffic: initialCampaignData.paid || false,
					audioFormat: "Música",
				},
			});

			setCampaignBudget({
				startDate: initialCampaignData.beginning || "",
				endDate: initialCampaignData.end || "",
				influencersCount: initialCampaignData.open_jobs || 0,
				creatorFee: initialCampaignData.price || 0,
			});

			setResponsibleInfo({
				name: initialCampaignData.responsible_name || "",
				email: initialCampaignData.responsible_email || "",
				phone: initialCampaignData.responsible_phone || "",
				cpf: initialCampaignData.responsible_cpf || "",
			});
		}
	}, [isEditMode, initialCampaignData]);

	// Update campaign function (for edit mode)
	const updateCampaign = async (): Promise<Campaign> => {
		const formData = new FormData();
		formData.append("name", campaignData.basicInfo.campaignName);
		if (campaignData.basicInfo.coverImage) {
			formData.append("cover_img", campaignData.basicInfo.coverImage);
		}
		formData.append("objective", campaignData.basicInfo.format);
		formData.append("product_url", campaignData.basicInfo.productUrl);
		formData.append("description", campaignData.basicInfo.campaignDetails);
		campaignData.basicInfo.disseminationChannels.forEach((channel) => {
			formData.append("channels", channel);
		});
		campaignData.audienceSegmentation.niche.forEach((nicheId) => {
			formData.append("niche", nicheId);
		});
		formData.append("min_age", campaignData.audienceSegmentation.minAge);
		formData.append("max_age", campaignData.audienceSegmentation.maxAge);
		formData.append("gender", campaignData.audienceSegmentation.gender);
		formData.append(
			"min_followers",
			campaignData.audienceSegmentation.minFollowers,
		);
		formData.append("locality", campaignData.audienceSegmentation.location);
		formData.append(
			"min_video_duration",
			campaignData.audienceSegmentation.videoMinDuration,
		);
		formData.append(
			"max_video_duration",
			campaignData.audienceSegmentation.videoMaxDuration,
		);
		formData.append(
			"paid_traffic",
			campaignData.audienceSegmentation.paidTraffic ? "true" : "false",
		);
		formData.append("beginning", campaignBudget.startDate);
		formData.append("end", campaignBudget.endDate);
		formData.append(
			"open_jobs",
			campaignBudget.influencersCount.toString(),
		);
		formData.append("price", campaignBudget.creatorFee.toString());
		formData.append("responsible_name", responsibleInfo.name);
		formData.append("responsible_email", responsibleInfo.email);
		formData.append("responsible_phone", responsibleInfo.phone);
		formData.append("responsible_cpf", responsibleInfo.cpf);

		return await pb.collection("Campaigns").update(campaignId, formData);
	};

	const { data: niches, isLoading: nichesLoading } = useQuery<Niche[]>({
		queryKey: ["niches"],
		queryFn: async () => {
			const records = await pb.collection("Niches").getFullList<Niche>();
			return records;
		},
	});

	const router = useRouter();
	const user = getUserData();

	const { data: brandInfo, isLoading: brandLoading } = useQuery({
		queryKey: ["brandInfo", user.model.id],
		queryFn: async () => {
			return await pb.collection("Brands").getOne(user.model.id);
		},
	});

	useEffect(() => {
		if (!brandLoading && brandInfo) {
			console.log("verificar campos");
			const requiredFields = ["name"];
			const missingFields = requiredFields.filter(
				(field) => !brandInfo[field],
			);

			if (missingFields.length > 0) {
				const username = user.model.username;
				console.log("redirecionar para editar");
				router.navigate({ to: `/marca/${username}/editar` });
			}
		}
	}, [brandLoading, brandInfo, user.model.username, router]);

	const createCampaign = async (): Promise<Campaign> => {
		const formData = new FormData();

		if (!user.model.id) {
			toast.error(
				"Erro ao processar informação, por favor realize o login novamente",
			);
			throw new Error("User ID is missing");
		}

		formData.append("brand", user.model.id || "");
		formData.append("status", "ready");

		formData.append("name", campaignData.basicInfo.campaignName);
		if (campaignData.basicInfo.coverImage) {
			formData.append("cover_img", campaignData.basicInfo.coverImage);
		}
		formData.append("objective", campaignData.basicInfo.format);
		formData.append("product_url", campaignData.basicInfo.productUrl);
		formData.append("description", campaignData.basicInfo.campaignDetails);
		campaignData.basicInfo.disseminationChannels.forEach((channel) => {
			formData.append("channels", channel);
		});
		campaignData.audienceSegmentation.niche.forEach((nicheId) => {
			formData.append("niche", nicheId);
		});
		formData.append("min_age", campaignData.audienceSegmentation.minAge);
		formData.append("max_age", campaignData.audienceSegmentation.maxAge);
		formData.append("gender", campaignData.audienceSegmentation.gender);
		formData.append(
			"min_followers",
			campaignData.audienceSegmentation.minFollowers,
		);
		formData.append("locality", campaignData.audienceSegmentation.location);
		formData.append(
			"min_video_duration",
			campaignData.audienceSegmentation.videoMinDuration,
		);
		formData.append(
			"max_video_duration",
			campaignData.audienceSegmentation.videoMaxDuration,
		);
		formData.append(
			"paid_traffic",
			campaignData.audienceSegmentation.paidTraffic ? "true" : "false",
		);
		formData.append(
			"audio_format",
			campaignData.audienceSegmentation.audioFormat,
		);
		formData.append("beginning", campaignBudget.startDate);
		formData.append("end", campaignBudget.endDate);

		formData.append(
			"max_subscriptions",
			campaignBudget.influencersCount.toString(),
		);
		formData.append(
			"open_jobs",
			campaignBudget.influencersCount.toString(),
		);
		formData.append(
			"price",
			(
				campaignBudget.influencersCount * campaignBudget.creatorFee
			).toString(),
		);
		formData.append("paid", "false");
		formData.append("responsible_name", responsibleInfo.name);
		formData.append("responsible_email", responsibleInfo.email);
		formData.append("responsible_phone", responsibleInfo.phone);
		formData.append("responsible_cpf", responsibleInfo.cpf);

		const createdCampaign: Campaign = await pb
			.collection("Campaigns")
			.create(formData);

		return createdCampaign;
	};

	const mutate = useMutation<Campaign, Error, void>({
		mutationFn: isEditMode ? updateCampaign : createCampaign,
		onSuccess: async (createdCampaign: Campaign) => {
			if (isEditMode) {
				toast.success("Campanha atualizada com sucesso!"); // Mensagem para modo de edição
				console.log(
					"Campanha atualizada:",
					createdCampaign.id,
					createdCampaign.name,
				);
			} else {
				toast.success("Campanha criada com sucesso!"); // Mensagem para criação de campanha

				console.log(createdCampaign.id);
				console.log(createdCampaign.name);
				console.log(campaignBudget.creatorFee);

				const response = await fetch(
					"https://conecte-publi.pockethost.io/api/checkout_campaign",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${user.token}`,
						},
						body: JSON.stringify({
							campaign_id: createdCampaign.id,
							campaign_name: createdCampaign.name,
							unit_amount: campaignBudget.creatorFee,
						}),
					},
				);

				console.log("data payment");
				console.log(response);

				if (response.ok) {
					const data = await response.json();
					if (data.payment_url) {
						window.location.href = data.payment_url;
					} else {
						toast.error(
							"Erro ao iniciar o pagamento. Tente novamente.",
						);
					}
				} else {
					toast.error(
						"Erro ao iniciar o pagamento. Tente novamente.",
					);
				}
			}
		},
		onError: (e) => {
			console.log(e);
			toast.error("Erro ao criar a campanha. Tente novamente.");
		},
	});

	const handleSubmit = () => {
		const missingFields: string[] = [];

		if (!campaignData.basicInfo.campaignName)
			missingFields.push("Nome da Campanha");
		if (!responsibleInfo.name) missingFields.push("Nome do Responsável");
		if (!responsibleInfo.email) missingFields.push("Email do Responsável");
		if (!responsibleInfo.phone)
			missingFields.push("Telefone do Responsável");
		if (!responsibleInfo.cpf) missingFields.push("CPF do Responsável");

		if (missingFields.length > 0) {
			const message =
				missingFields.length > 3
					? `Campos obrigatórios não preenchidos: ${missingFields
							.slice(0, 3)
							.join(", ")}, etc.`
					: `Campos obrigatórios não preenchidos: ${missingFields.join(", ")}`;

			toast.warn(message);
			return;
		}

		mutate.mutate();
	};

	return (
		<div className="flex flex-col items-center justify-center">
			<BasicInfoSection
				data={campaignData.basicInfo}
				onChange={(data) =>
					setCampaignData((prev) => ({ ...prev, basicInfo: data }))
				}
			/>

			<AudienceSegmentationSection
				data={campaignData.audienceSegmentation}
				onChange={(data) =>
					setCampaignData((prev) => ({
						...prev,
						audienceSegmentation: data,
					}))
				}
				niches={niches}
				nichesLoading={nichesLoading}
			/>

			<CampaignBudgetSection
				startDate={campaignBudget.startDate}
				endDate={campaignBudget.endDate}
				influencersCount={campaignBudget.influencersCount}
				creatorFee={campaignBudget.creatorFee}
				onChange={(data) => setCampaignBudget(data)}
				isEditMode={isEditMode}
			/>

			<ResponsibleInfoSection
				data={responsibleInfo}
				onChange={setResponsibleInfo}
			/>

			<button
				onClick={handleSubmit}
				className="w-[200px] bg-blue-700 text-white py-2 rounded-md mt-6 mb-8"
				disabled={mutate.isPending}
			>
				{mutate.isPending ? "Carregando..." : "Finalizar"}
			</button>

			<ToastContainer />
		</div>
	);
};

type BasicInfoSectionProps = {
	data: CampaignData["basicInfo"];
	onChange: (data: CampaignData["basicInfo"]) => void;
};

function BasicInfoSection({ data, onChange }: BasicInfoSectionProps) {
	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		onChange({
			...data,
			[name]: value,
		});
	};

	const handleFormatChange = (format: string) => {
		onChange({
			...data,
			format,
		});
	};

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			onChange({
				...data,
				coverImage: e.target.files[0],
			});
		}
	};

	const toggleChannel = (channelValue: string) => {
		const updatedChannels = data.disseminationChannels.includes(
			channelValue,
		)
			? data.disseminationChannels.filter((ch) => ch !== channelValue)
			: [...data.disseminationChannels, channelValue];

		onChange({
			...data,
			disseminationChannels: updatedChannels,
		});
	};

    console.log("data.coverImage", data.coverImage)

	return (
		<div className="w-full">
			<h2 className="text-lg font-medium text-white mb-6 bg-blue-700 py-2 px-5">
				Informações Básicas da Campanha
			</h2>

			<div className="grid grid-cols-2 gap-6 mb-6 px-5">
				<div>
					<div className="mb-8">
						<label className="block mb-2 text-gray-700 font-semibold">
							Nome da campanha*
						</label>
						<input
							type="text"
							name="campaignName"
							value={data.campaignName}
							onChange={handleInputChange}
							className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Nome da campanha"
						/>
						<p className="text-gray-500 mt-2">
							O nome é a primeira informação que os criadores de
							conteúdo visualizam.
						</p>
					</div>

					<div>
						<label className="block mb-2 text-gray-700 font-semibold">
							Formato da campanha*
						</label>
						<div className="flex space-x-4">
							{objectiveOptions.map((option) => (
								<button
									key={option.value}
									onClick={() =>
										handleFormatChange(option.value)
									}
									className={`flex-1 px-4 py-2 border rounded-md ${
										data.format === option.value
											? "border-blue-500 text-blue-500"
											: "border-gray-300 text-gray-700"
									}`}
								>
									{option.label}
								</button>
							))}
						</div>
						<p className="text-gray-500 mt-2">
							{data.format === "UGC"
								? "UGC (Talentos): O criador de conteúdo fornece o vídeo para você postar nas suas redes sociais ou usar em anúncios."
								: "Influencers (Nano, Micro e Macro influenciadores): O criador de conteúdo posta o vídeo nas redes sociais dele ou em colaboração com sua marca."}
						</p>
					</div>
				</div>

				<div className="col-span-1">
					<label className="block mb-2 text-gray-700 font-semibold">
						Foto de capa*
					</label>
					<div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-4 rounded-md h-[150px]">
						<input
							type="file"
							onChange={handleImageUpload}
							className="hidden"
							id="coverImage"
						/>
						<label
							htmlFor="coverImage"
							className="text-blue-500 cursor-pointer"
						>
							Carregue ou arraste e solte
						</label>
						{data.coverImage && (
						    <p className="text-gray-600 mt-2">
						        {typeof data.coverImage === 'string' ? data.coverImage : data.coverImage.name}
						    </p>
						)}
					</div>
					<p className="text-gray-500 mt-2 text-sm">
						Tamanho recomendado: 1200x628px para garantir melhor
						qualidade.
					</p>
				</div>

				<div className="col-span-2">
					<label className="block text-gray-700 font-semibold">
						URL do Produto ou Perfil*
					</label>

					<p className="text-gray-500 mb-2">
						Descreva o que você espera que os criadores façam. Dê
						instruções claras para que eles entendam suas
						expectativas.
					</p>

					<input
						type="url"
						name="productUrl"
						value={data.productUrl || ""}
						onChange={handleInputChange}
						className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="https://example.com"
					/>
				</div>

				<div className="col-span-2">
					<div className="flex items-center justify-between">
						<div>
							<label className="block text-gray-700 font-semibold">
								Detalhes da campanha*
							</label>

							<p className="text-gray-500 mb-2">
								Descreva o que você espera que os criadores
								façam. Dê instruções claras para que eles
								entendam suas expectativas.
							</p>
						</div>

						<div>
							<Button variant={"orange"}>Ver instruções</Button>
						</div>
					</div>

					<textarea
						name="campaignDetails"
						value={data.campaignDetails}
						onChange={handleInputChange}
						className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Inclua as hashtags obrigatórias, chamadas de ação, e qualquer outro detalhe importante que seja necessário para completar a campanha."
					/>
				</div>

				<div className="col-span-2">
					<div className="col-span-2">
						<label className="block mb-2 text-gray-700 font-semibold">
							Canais de divulgação*
						</label>

						<div className="flex flex-wrap gap-4 mt-2">
							{channelsOptions.map((channel) => (
								<button
									key={channel.value}
									onClick={() => toggleChannel(channel.value)}
									className={`flex items-center gap-2 px-4 py-2 border rounded-md ${
										data.disseminationChannels.includes(
											channel.value,
										)
											? "border-blue-500 text-blue-500"
											: "border-gray-300 text-gray-700"
									}`}
								>
									{
										channelIcons[
											channel.value as keyof typeof channelIcons
										]
									}{" "}
									{channel.label}
								</button>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

type AudienceSegmentationSectionProps = {
	data: CampaignData["audienceSegmentation"];
	onChange: (data: CampaignData["audienceSegmentation"]) => void;
	niches: Niche[] | undefined;
	nichesLoading: boolean;
};

function AudienceSegmentationSection({
	data,
	onChange,
	niches,
	nichesLoading,
}: AudienceSegmentationSectionProps) {
	const [nicheOptions, setNicheOptions] = useState<Niche[]>([]);
	const [selectedNiches, setSelectedNiches] = useState<Niche[]>([]);
	const [dropdownOpen, setDropdownOpen] = useState(false);

	const dropdownRef = useRef<HTMLDivElement>(null);

useEffect(() => {
    if (niches && data.niche.length > 0) {
        // Filter the niche options that are already selected
        const preSelectedNiches = niches.filter(niche =>
            data.niche.includes(niche.id)
        );
        setSelectedNiches(preSelectedNiches);
        
        // Set available niche options by removing the pre-selected ones
        const availableNiches = niches.filter(
            niche => !data.niche.includes(niche.id)
        );
        setNicheOptions(availableNiches);
    } else if (niches) {
        // Set all niches as options if nothing is pre-selected
        setNicheOptions(niches);
    }
}, [niches, data.niche]);



	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setDropdownOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleNicheSelect = (niche: Niche) => {
		setSelectedNiches([...selectedNiches, niche]);
		setNicheOptions(nicheOptions.filter((n) => n.id !== niche.id));
		onChange({
			...data,
			niche: [...data.niche, niche.id],
		});
	};

	const handleNicheRemove = (niche: Niche) => {
		setSelectedNiches(selectedNiches.filter((n) => n.id !== niche.id));
		setNicheOptions([...nicheOptions, niche]);
		onChange({
			...data,
			niche: data.niche.filter((id: string) => id !== niche.id),
		});
	};

	const toggleDropdown = () => {
		setDropdownOpen(!dropdownOpen);
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		onChange({
			...data,
			[name]: value,
		});
	};

	const handleToggleChange = (
		field: "paidTraffic" | "audioFormat",
		value: unknown,
	) => {
		onChange({
			...data,
			[field]: value,
		});
	};

	return (
		<div className="w-full mt-8">
			<h2 className="text-lg font-medium text-white mb-6 bg-blue-700 py-2 px-5">
				Segmentação do Público e Especificações
			</h2>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-5 mb-6">
				<div className="mb-4 relative">
					<label className="block mb-2 text-gray-700 font-semibold">
						Nicho (opcional)
					</label>
					<div className="relative" ref={dropdownRef}>
						<button
							type="button"
							onClick={toggleDropdown}
							className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-left"
						>
							{selectedNiches.length > 0
								? `${selectedNiches.length} nicho(s) selecionado(s)`
								: "Selecionar nichos"}
						</button>
						{dropdownOpen && (
							<div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-auto">
								{nichesLoading ? (
									<div className="px-4 py-2">
										Carregando...
									</div>
								) : nicheOptions.length > 0 ? (
									nicheOptions.map((niche) => (
										<div
											key={niche.id}
											className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
											onClick={() =>
												handleNicheSelect(niche)
											}
										>
											{niche.niche}
										</div>
									))
								) : (
									<div className="px-4 py-2 text-gray-500">
										Todos os nichos foram selecionados
									</div>
								)}
							</div>
						)}
					</div>
					<div className="mt-2 flex flex-wrap gap-2">
						{selectedNiches.map((niche) => (
							<span
								key={niche.id}
								className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full"
							>
								{niche.niche}
								<button
									type="button"
									className="ml-2 text-blue-500"
									onClick={() => handleNicheRemove(niche)}
								>
									x
								</button>
							</span>
						))}
					</div>
					<p className="text-gray-500 mt-2">
						Escolha quais nichos de criadores de conteúdo fazem mais
						sentido para essa campanha.
					</p>
				</div>

				<div className="col-span-1 md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-6">
					<div className="col-span-1">
						<label className="block mb-2 text-gray-700 font-semibold">
							Idade (opcional)
						</label>
						<div className="flex space-x-4">
							<select
								name="minAge"
								value={data.minAge}
								onChange={handleInputChange}
								className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="" hidden>
									Mínimo
								</option>
								{minAgeOptions.map((option) => (
									<option
										key={option.value}
										value={option.value}
									>
										{option.label}
									</option>
								))}
							</select>
							<select
								name="maxAge"
								value={data.maxAge}
								onChange={handleInputChange}
								className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="" hidden>
									Máximo
								</option>
								{maxAgeOptions.map((option) => (
									<option
										key={option.value}
										value={option.value}
									>
										{option.label}
									</option>
								))}
							</select>
						</div>
						<p className="text-gray-500 mt-2">
							Qual a idade mínima e máxima que os candidatos devem
							ter.
						</p>
					</div>

					<div className="col-span-1 md:col-span-1">
						<label className="block mb-2 text-gray-700 font-semibold">
							Gênero (opcional)
						</label>
						<select
							name="gender"
							value={data.gender}
							onChange={handleInputChange}
							className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="" hidden>
								Selecionar gênero
							</option>
							{genderOptions.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
						<p className="text-gray-500 mt-2">
							Gênero dos influenciadores.
						</p>
					</div>
				</div>
			</div>

			<div className="px-5 mb-6 grid gap-6 md:grid-cols-2">
				<div>
					<label className="block mb-2 text-gray-700 font-semibold">
						Mínimo de Seguidores (opcional)
					</label>
					<select
						name="minFollowers"
						value={data.minFollowers}
						onChange={handleInputChange}
						className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="" hidden>
							Selecionar mínimo de seguidores
						</option>
						{minFollowersOptions.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</div>

				<div>
					<label className="block mb-2 text-gray-700 font-semibold">
						Localidade (opcional)
					</label>
					<select
						name="location"
						value={data.location}
						onChange={handleInputChange}
						className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="" hidden>
							Selecionar localidade
						</option>
						{localityOptions.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</div>

				<div className="col-span-2 grid grid-cols-2 gap-4">
					<div>
						<label className="block mb-2 text-gray-700 font-semibold">
							Duração do vídeo (opcional)
						</label>
						<select
							name="videoMinDuration"
							value={data.videoMinDuration}
							onChange={handleInputChange}
							className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="" hidden>
								Mínimo
							</option>
							{minVideoDurationOptions.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
					</div>

					<div>
						<label className="block mb-2 text-gray-700 font-semibold invisible">
							Duração do vídeo
						</label>
						<select
							name="videoMaxDuration"
							value={data.videoMaxDuration}
							onChange={handleInputChange}
							className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="" hidden>
								Máximo
							</option>
							{maxVideoDurationOptions.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
					</div>
				</div>

				<div>
					<label className="block mb-2 text-gray-700 font-semibold">
						Pretende utilizar o material para tráfego pago
						(anúncios)? (opcional)
					</label>
					<div className="flex space-x-4">
						<button
							type="button"
							onClick={() =>
								handleToggleChange("paidTraffic", false)
							}
							className={`flex-1 px-4 py-2 border rounded-md ${
								data.paidTraffic === false
									? "border-blue-500 text-blue-500"
									: "border-gray-300 text-gray-700"
							}`}
						>
							Não
						</button>
						<button
							type="button"
							onClick={() =>
								handleToggleChange("paidTraffic", true)
							}
							className={`flex-1 px-4 py-2 border rounded-md ${
								data.paidTraffic === true
									? "border-blue-500 text-blue-500"
									: "border-gray-300 text-gray-700"
							}`}
						>
							Sim
						</button>
					</div>
					<p className="text-gray-500 mt-2">
						Escolha uma das opções abaixo. Tráfego pago: Anúncios na
						Meta Ads, Tiktok Ads, Google ou Ecommerce. Tráfego
						orgânico: Veicular os conteúdos em qualquer rede social
						de sua escolha.
					</p>
				</div>

				<div>
					<label className="block mb-2 text-gray-700 font-semibold">
						Formato do áudio (opcional)
					</label>
					<div className="flex space-x-4">
						<button
							type="button"
							onClick={() =>
								handleToggleChange("audioFormat", "Música")
							}
							className={`flex-1 px-4 py-2 border rounded-md ${
								data.audioFormat === "Música"
									? "border-blue-500 text-blue-500"
									: "border-gray-300 text-gray-700"
							}`}
						>
							Música
						</button>
						<button
							type="button"
							onClick={() =>
								handleToggleChange("audioFormat", "Narração")
							}
							className={`flex-1 px-4 py-2 border rounded-md ${
								data.audioFormat === "Narração"
									? "border-blue-500 text-blue-500"
									: "border-gray-300 text-gray-700"
							}`}
						>
							Narração
						</button>
					</div>
					<p className="text-gray-500 mt-2">
						Como você gostaria? Escolha se o vídeo deve ser criado
						com uma música de fundo ou se é necessário que o criador
						de conteúdo narre o vídeo.
					</p>
				</div>
			</div>
		</div>
	);
}

type CampaignBudgetSectionProps = {
    startDate: string;
    endDate: string;
    influencersCount: number;
    creatorFee: number;
    onChange: (data: CampaignBudget) => void;
    isEditMode: boolean; // Corrected type from {isEditMode} to boolean
};

function CampaignBudgetSection({
    startDate,
    endDate,
    influencersCount,
    creatorFee,
    onChange,
    isEditMode,
}: CampaignBudgetSectionProps) {
	console.log("startDate", startDate)
	
    // Helper function to format the date as YYYY-MM-DD
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const formattedStartDate = startDate ? formatDate(startDate) : "";
    const formattedEndDate = endDate ? formatDate(endDate) : "";

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        onChange({
            ...{ startDate, endDate, influencersCount, creatorFee },
            [name]:
                name === "influencersCount" || name === "creatorFee"
                    ? Number(value)
                    : value,
        });
    };

    return (
        <div className="w-full mt-8">
            <h2 className="text-lg font-medium text-white mb-6 bg-blue-700 py-2 px-5">
                Período da Campanha e Orçamento
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-5 mb-6">
                <div>
                    <label className="block mb-2 text-gray-700 font-semibold">
                        Data de Início*
                    </label>
                    <input
                        type="date"
                        name="startDate"
                        value={formattedStartDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block mb-2 text-gray-700 font-semibold">
                        Fim da Campanha*
                    </label>
                    <input
                        type="date"
                        name="endDate"
                        value={formattedEndDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="px-5 mb-6">
                <label className="block mb-2 text-gray-700 font-semibold">
                    Quantos influenciadores você deseja na campanha?*
                </label>
                <input
                    type="number"
                    name="influencersCount"
                    value={influencersCount || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Exemplo: 6"
                    min={0}
                    disabled={isEditMode} // Disable if isEditMode is true
                />
            </div>

            <div className="px-5 mb-3">
                <label className="block mb-2 text-gray-700 font-semibold">
                    Valor por criador*
                </label>
                <input
                    type="number"
                    name="creatorFee"
                    value={creatorFee || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Exemplo: R$500,00"
                    min={0}
                    disabled={isEditMode} // Disable if isEditMode is true
                />
            </div>

            <div className="px-5 text-gray-800 font-semibold">
                Orçamento total da campanha: R$
                {(influencersCount * creatorFee).toLocaleString("pt-BR")}
            </div>
        </div>
    );
}

const ResponsibleInfoSection: React.FC<{
	data: ResponsibleInfo;
	onChange: (data: ResponsibleInfo) => void;
}> = ({ data, onChange }) => {
	const formatCPF = (value: string) => {
		return value
			.replace(/\D/g, "")
			.replace(/(\d{3})(\d)/, "$1.$2")
			.replace(/(\d{3})(\d)/, "$1.$2")
			.replace(/(\d{3})(\d{1,2})$/, "$1-$2")
			.slice(0, 14);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		onChange({
			...data,
			[name]: name === "cpf" ? formatCPF(value) : value,
		});
	};

	return (
		<div className="w-full mt-8">
			<h2 className="text-lg font-medium text-white mb-6 bg-blue-700 py-2 px-5">
				Informações do Responsável pela Campanha
			</h2>
			<div className="px-5 mb-6">
				<p className="text-gray-700 mb-4">
					Essas informações serão apenas para controle interno da
					equipe da ConectePubli.
				</p>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
					<div>
						<label className="block mb-2 text-gray-700 font-semibold">
							Nome*
						</label>
						<input
							type="text"
							name="name"
							value={data.name}
							onChange={handleInputChange}
							className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Nome do responsável"
						/>
					</div>
					<div>
						<label className="block mb-2 text-gray-700 font-semibold">
							E-mail*
						</label>
						<input
							type="email"
							name="email"
							value={data.email}
							onChange={handleInputChange}
							className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Email do responsável"
						/>
					</div>
					<div>
						<label className="block mb-2 text-gray-700 font-semibold">
							Telefone*
						</label>
						<input
							type="tel"
							name="phone"
							value={data.phone}
							onChange={handleInputChange}
							className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Telefone do responsável"
						/>
					</div>
					<div>
						<label className="block mb-2 text-gray-700 font-semibold">
							CPF*
						</label>
						<input
							type="text"
							name="cpf"
							value={data.cpf}
							onChange={handleInputChange}
							className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="CPF do responsável"
							maxLength={14}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
