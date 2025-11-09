import React, { useState, useEffect } from 'react';
import { useAuth, useToast } from '../../App';
import { Card, Button, Modal, ConfirmationModal } from '../../components/UI';
import { Profile, UsefulLink } from '../../types';
import { getLinks, addLink, updateLink, deleteLink } from '../../services/api';
import { PlusIcon, LinkIcon, PencilIcon, TrashIcon, SpinnerIcon } from '../../components/Icons';

const LinksUteis: React.FC = () => {
    // FIX: Destructure currentUser from useAuth to access the user's profile.
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    const [links, setLinks] = useState<UsefulLink[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLink, setEditingLink] = useState<UsefulLink | null>(null);
    const [itemToDelete, setItemToDelete] = useState<UsefulLink | null>(null);
    const [formData, setFormData] = useState({ title: '', url: '', category: '', visibility: [Profile.Colaborador, Profile.Psicologo] });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await getLinks();
                setLinks(data);
            } catch (err) {
                setError("Não foi possível carregar os links.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleOpenModal = (link: UsefulLink | null = null) => {
        setEditingLink(link);
        setFormData(link ? { ...link } : { title: '', url: '', category: '', visibility: [Profile.Colaborador, Profile.Psicologo] });
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        setIsSubmitting(true);
        try {
            if (editingLink) {
                const updated = await updateLink({ ...editingLink, ...formData });
                setLinks(links.map(l => l.id === updated.id ? updated : l));
                addToast("Link atualizado!", "success");
            } else {
                const added = await addLink(formData);
                setLinks([added, ...links]);
                addToast("Link adicionado!", "success");
            }
            setIsModalOpen(false);
        } catch (err) {
            addToast("Falha ao salvar. Tente novamente.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;
        setIsSubmitting(true);
        try {
            await deleteLink(itemToDelete.id);
            setLinks(links.filter(l => l.id !== itemToDelete.id));
            addToast("Link excluído.", "success");
        } catch (e) {
            addToast("Falha ao excluir.", "error");
        } finally {
            setIsSubmitting(false);
            setItemToDelete(null);
        }
    };

    const groupedLinks = links.reduce((acc: Record<string, UsefulLink[]>, link) => {
        const category = link.category;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(link);
        return acc;
    }, {});

    const renderContent = () => {
        if (isLoading) return <div className="flex justify-center items-center p-8"><SpinnerIcon className="w-8 h-8 text-primary" /></div>;
        if (error) return <div className="text-center text-red-600 bg-red-100 p-4 rounded-md">{error}</div>;

        return (
             <div className="space-y-6">
                {Object.entries(groupedLinks).map(([category, items]) => (
                    <div key={category}>
                        <h4 className="text-lg font-bold text-primary mb-2 pb-1 border-b-2 border-primary">{category}</h4>
                        <div className="space-y-2">
                            {items.map(l => (
                                <Card key={l.id} className="py-3 px-4 flex justify-between items-center">
                                    <a href={l.url} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-700 hover:text-primary font-medium">
                                        <LinkIcon className="w-5 h-5 mr-3"/> {l.title}
                                    </a>
                                    {/* FIX: Use currentUser.profile to check for permissions. */}
                                    {currentUser?.profile === Profile.Gestao && (
                                        <div className="flex space-x-2">
                                            <Button variant="secondary" size="sm" onClick={() => handleOpenModal(l)}><PencilIcon className="w-4 h-4"/></Button>
                                            <Button variant="danger" size="sm" onClick={() => setItemToDelete(l)}><TrashIcon className="w-4 h-4"/></Button>
                                        </div>
                                    )}
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-semibold text-gray-800">Links Úteis</h3>
                {/* FIX: Use currentUser.profile to check for permissions. */}
                {currentUser?.profile === Profile.Gestao && <Button onClick={() => handleOpenModal()}><PlusIcon className="w-4 h-4 mr-2" /> Adicionar Link</Button>}
            </div>
            {renderContent()}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingLink ? "Editar Link" : "Adicionar Link"}>
                <div className="space-y-4">
                    <input type="text" placeholder="Título" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2 border rounded-md" />
                    <input type="text" placeholder="Categoria" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-2 border rounded-md" />
                    <input type="url" placeholder="URL Completa" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} className="w-full p-2 border rounded-md" />
                    {/* TODO: Adicionar seletor de visibilidade se necessário */}
                    <div className="flex justify-end space-x-2">
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Cancelar</Button>
                        <Button onClick={handleSave} isLoading={isSubmitting}>Salvar</Button>
                    </div>
                </div>
            </Modal>
             <ConfirmationModal
                isOpen={!!itemToDelete}
                onClose={() => setItemToDelete(null)}
                onConfirm={handleConfirmDelete}
                title="Confirmar Exclusão"
                message={<>Tem certeza que deseja excluir o link <strong>"{itemToDelete?.title}"</strong>?</>}
                isConfirming={isSubmitting}
            />
        </div>
    );
};

export default LinksUteis;