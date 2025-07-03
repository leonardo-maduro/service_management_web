import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMaterials, deleteMaterial } from "./api";
import ModalDialog from '../shared/modal/ModalDialog';

function MaterialsList() {
  const [materials, setMaterials] = useState([]);
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState(null);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [resultDialogMsg, setResultDialogMsg] = useState("");

  useEffect(() => {
    getMaterials()
      .then(data => {
        console.log('Dados recebidos:', data);
        if (data.success) {
          
          setMaterials(data.data);
        } else {
          setMaterials([]);
        }
      })
      .catch(error => {
        setMaterials([]);
        console.error('Erro ao buscar os dados:', error);
      });
  }, []);

  const handleDeleteClick = (material) => {
    setMaterialToDelete(material);
    setShowDeleteDialog(true);
  };
  const handleConfirmDelete = () => {
    setShowDeleteDialog(false);
    deleteMaterial(materialToDelete.id)
      .then(data => {
        if (data.success) {
          setMaterials(materials.filter(material => material.id !== materialToDelete.id));
          setResultDialogMsg("Material excluído com sucesso!");
        } else {
          setResultDialogMsg("Erro ao excluir o material.");
        }
        setShowResultDialog(true);
      })
      .catch(error => {
        setResultDialogMsg("Erro ao excluir o material.");
        setShowResultDialog(true);
        console.error('Erro ao excluir o material:', error);
      });
    setMaterialToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setMaterialToDelete(null);
  };

  const handleEdit = (materialId) => {
    navigate(`/editar-material/${materialId}`);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStockStatus = (currentStock, minimumStock) => {
    if (currentStock <= minimumStock) {
      return { text: 'Baixo', class: 'badge bg-danger' };
    } else if (currentStock <= minimumStock * 1.5) {
      return { text: 'Atenção', class: 'badge bg-warning' };
    } else {
      return { text: 'Normal', class: 'badge bg-success' };
    }
  };
  return (
    <div className="app-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="app-title">Gerenciar Materiais</h2>
        <button 
          className="btn-success app-btn"
          onClick={() => navigate('/cadastrar-material')}
        >
          + Novo Material
        </button>
      </div>

      <div className="table-container">
        <table className="app-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Unidade</th>
              <th>Preço Unit.</th>
              <th>Estoque</th>
              <th>Estoque Mín.</th>
              <th>Status</th>
              <th style={{ textAlign: 'center', width: '120px' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {materials.length > 0 ? (
              materials.map((material) => {
                const stockStatus = getStockStatus(material.stock_quantity, material.minimum_stock);
                return (
                  <tr key={material.id}>
                    <td>{material.code}</td>
                    <td>
                      <div>
                        <strong>{material.name}</strong>
                        {material.description && (
                          <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>{material.description}</small>
                        )}
                      </div>
                    </td>
                    <td>{material.category}</td>
                    <td>{material.unit}</td>
                    <td>{formatCurrency(material.unit_price)}</td>
                    <td>{material.stock_quantity}</td>
                    <td>{material.minimum_stock}</td>
                    <td>
                      <span className={stockStatus.class} style={{ fontSize: '0.75rem' }}>
                        {stockStatus.text}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className="btn-primary app-btn"
                          style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
                          onClick={() => handleEdit(material.id)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn-danger app-btn"
                          style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
                          onClick={() => handleDeleteClick(material)}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" className="text-center" style={{ padding: '2rem', color: 'var(--text-secondary)' }}>
                  Nenhum material cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>      {/* Modal de Confirmação de Exclusão */}
      <ModalDialog
        show={showDeleteDialog}
        title="Excluir Material"
        message="Tem certeza que deseja excluir este material?"
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
        okText="Confirmar"
        cancelText="Cancelar"
      />

      {/* Modal de Resultado */}
      <ModalDialog
        show={showResultDialog}
        title={resultDialogMsg}
        onOk={() => setShowResultDialog(false)}
        okText="Ok"
      />
    </div>
  );
}

export default MaterialsList;
