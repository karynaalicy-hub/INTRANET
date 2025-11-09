import React, { useState, useEffect } from 'react';
import { useAuth, useToast } from '../../App';
import { Card, Button, Modal, ConfirmationModal } from '../../components/UI';
import { Profile, TrainingMaterial, MaterialType } from '../../types';
import { getTrainings, addTraining, updateTraining, deleteTraining } from '../../services/api';
import { PlusIcon, PencilIcon, TrashIcon, SpinnerIcon } from '../../components/Icons';

const Treinamentos: React.FC = () => {
    // FIX: Destructure currentUser from useAuth to access the user's profile.
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    const [trainings, setTrainings] = useState<TrainingMaterial[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTraining, setEditingTraining] = useState<TrainingMaterial | null>(null);
    const [itemToDelete, setItemToDelete] = useState<TrainingMaterial | null>(null);
    const [formData, setFormData] = useState({
        title: '', description: '', type: MaterialType.Video, url: '', category: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await getTrainings();
                setTrainings(data);
            } catch (err) {
                setError("Não foi possível carregar os treinamentos.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleOpenModal = (training: TrainingMaterial | null = null) => {
        setEditingTraining(training);
        setFormData(training ? { ...training } : { title: '', description: '', type: MaterialType.Video, url: '', category: '' });
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        setIsSubmitting(true);
        try {
            if (editingTraining) {
                const updated = await updateTraining({ ...editingTraining, ...formData });
                setTrainings(trainings.map(t => t.id === updated.id ? updated : t));
                addToast("Treinamento atualizado!", "success");
            } else {
                const added = await addTraining(formData);
                setTrainings([added, ...trainings]);
                addToast("Treinamento adicionado!", "success");
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
            await deleteTraining(itemToDelete.id);
            setTrainings(trainings.filter(t => t.id !== itemToDelete.id));
            addToast("Treinamento excluído.", "success");
        } catch (e) {
            addToast("Falha ao excluir.", "error");
        } finally {
            setIsSubmitting(false);
            setItemToDelete(null);
        }
    };
    
    const groupedTrainings = trainings.reduce((acc: Record<string, TrainingMaterial[]>, item) => {
        const category = item.category;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(item);
        return acc;
    }, {});

    const renderContent = () => {
        if (isLoading) return <div className="flex justify-center items-center p-8"><SpinnerIcon className="w-8 h-8 text-primary" /></div>;
        if (error) return <div className="text-center text-red-600 bg-red-100 p-4 rounded-md">{error}</div>;

        return (
            <div className="space-y-6">
                {Object.entries(groupedTrainings).map(([category, items]) => (
                    <div key={category}>
                        <h4 className="text-lg font-bold text-primary mb-2 pb-1 border-b-2 border-primary">{category}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {items.map(t => (
                                <Card key={t.id} className="relative">
                                    <div>
                                        <h4 className="font-bold text-lg">{t.title}</h4>
                                        <a href={t.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Acessar material</a>
                                    </div>
                                    {/* FIX: Use currentUser.profile to check for permissions. */}
                                    {currentUser?.profile === Profile.Gestao && (
                                        <div className="absolute top-4 right-4 flex space-x-2">
                                            <Button variant="secondary" size="sm" onClick={() => handleOpenModal(t)}><PencilIcon className="w-4 h-4"/></Button>
                                            <Button variant="danger" size="sm" onClick={() => setItemToDelete(t)}><TrashIcon className="w-4 h-4"/></Button>
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
                <h3 className="text-2xl font-semibold text-gray-800">Treinamentos</h3>
                {/* FIX: Use currentUser.profile to check for permissions. */}
                {currentUser?.profile === Profile.Gestao && <Button onClick={() => handleOpenModal()}><PlusIcon className="w-4 h-4 mr-2" /> Adicionar</Button>}
            </div>
            {renderContent()}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingTraining ? "Editar Treinamento" : "Adicionar Treinamento"}>
                <div className="space-y-4">
                    <input type="text" placeholder="Título" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2 border rounded-md" />
                    <input type="text" placeholder="Categoria" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-2 border rounded-md" />
                    <textarea placeholder="Descrição" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} className="w-full p-2 border rounded-md"></textarea>
                    <input type="url" placeholder="URL do Material" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} className="w-full p-2 border rounded-md" />
                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as MaterialType})} className="w-full p-2 border rounded-md bg-white">
                        <option value={MaterialType.Video}>Vídeo</option>
                        <option value={MaterialType.PDF}>PDF</option>
                    </select>
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
                message={<>Tem certeza que deseja excluir o treinamento <strong>"{itemToDelete?.title}"</strong>?</>}
                isConfirming={isSubmitting}
            />
        </div>
    );
};

export default Treinamentos;