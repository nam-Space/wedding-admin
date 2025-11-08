/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Popconfirm, Space, } from "antd";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { callDeleteUserById, callGetUsers } from "../../config/api";
import { ActionType, ProColumns } from "@ant-design/pro-components";
import DataTable from "../antd/Table";
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import ModalUser from "./ModalUser";
import { getUserAvatar } from "../../utils/imageUrl";
import dayjs from "dayjs";
import { LOCATION, LOCATION_VI, POINT } from "../../constants/location";
import { IoMdFemale } from "react-icons/io";
import { IoMdMale } from "react-icons/io";

const User = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [dataInit, setDataInit] = useState(null);

    const tableRef = useRef<ActionType>(null);
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 10,
        pages: 1,
        total: 0
    });
    const [isLoading, setIsLoading] = useState(false);

    const columns: ProColumns<any>[] = [
        {
            title: "STT",
            dataIndex: "stt",
            key: "stt",
            render: (_text, _record, index, _action) => {
                return <p>{index + 1}</p>;
            },
        },
        {
            title: "Họ và tên",
            dataIndex: "fullName",
            key: "fullName",
            render: (_text, record, _index, _action) => {
                return <div className="flex items-center gap-[10px]">
                    <img
                        src={getUserAvatar(record?.image)}
                        className="min-w-[40px] max-w-[40px] h-[40px] object-cover rounded-[50%]"
                    />
                    <div>
                        <p className="leading-[20px]">{`${record?.fullName}`}</p>
                    </div>
                </div>

            },
        },
        {
            title: "Link thiệp cưới",
            dataIndex: "url",
            key: "url",
            render: (_text, record, _index, _action) => {
                return <div className="w-[200px]">
                    <a href={record.url} target="_blank">{record.url}</a>
                </div>;
            },
        },
        {
            title: "Bài hát",
            dataIndex: "song",
            key: "song",
            render: (_text, record, _index, _action) => {
                return <div className="w-[200px]">
                    <a href={record.song} target="_blank">{record.song}</a>
                </div>;
            },
        },
        {
            title: "Địa điểm",
            dataIndex: "location",
            key: "location",
            render: (_text, record, _index, _action) => {

                return record.location ? <div>
                    <div className="flex items-center gap-[4px] font-semibold text-[20px]">
                        {record.location === LOCATION.GROOM ? <IoMdMale className="text-blue-500" /> : <IoMdFemale className="text-pink-500" />}

                        {(LOCATION_VI as any)[record.location]}
                    </div>
                    <div className="mt-[10px]">
                        <iframe
                            className="w-[250px] h-[200px]"
                            src={`https://www.google.com/maps?q=${(POINT as any)[record.location].lat},${(POINT as any)[record.location].lng}&z=15&output=embed`}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div> : <div></div>
            },
            width: 250
        },
        {
            title: "Thời gian tạo",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (_text, record, _index, _action) => {
                return <div>
                    {dayjs(record.createdAt).format("HH:mm:ss DD/MM/YYYY")}
                </div>;
            },
        },
        {
            title: "Hành động",
            key: "action",
            render: (_, record, _index, _action) => (
                <Space>
                    <EditOutlined
                        style={{
                            fontSize: 20,
                            color: '#ffa500',
                        }}
                        type=""
                        onClick={() => {
                            setOpenModal(true);
                            setDataInit(record);
                        }}
                    />

                    <Popconfirm
                        placement="leftTop"
                        title={"Xác nhận xóa người dùng"}
                        description={"Bạn chắc chắn muốn xóa người dùng"}
                        onConfirm={() => handleDeleteUser(record._id)}
                        okText={"Xác nhận"}
                        cancelText={"Hủy"}
                    >
                        <span style={{ cursor: "pointer", margin: "0 10px" }}>
                            <DeleteOutlined
                                style={{
                                    fontSize: 20,
                                    color: '#ff4d4f',
                                }}
                            />
                        </span>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const buildQuery = (params: any, _sort: any, _filter: any) => {
        let temp = ""

        const clone = { ...params, currentPage: params.current, limit: params.pageSize };
        delete clone.current
        delete clone.pageSize

        temp += `current=${clone.currentPage}`
        temp += `&limit=${clone.limit}`
        if (clone.fullName) {
            temp += `&fullName=${clone.fullName}`
        }
        temp += `&sort=-createdAt`
        return temp;
    }

    const reloadTable = () => {
        tableRef?.current?.reload();
    }

    const handleGetUsers = async (query: string) => {
        setIsLoading(true);
        const res: any = await callGetUsers(query);
        setIsLoading(false)
        if (res.isSuccess) {
            setData(res.data)
            setMeta(res.meta)
        }
    };

    const handleDeleteUser = async (id: number) => {
        try {
            const result: any = await callDeleteUserById(id);
            if (result.isSuccess) {
                toast.success("Xóa thành công!", {
                    position: "bottom-right",
                });
                reloadTable()
            } else {
                toast.error("Xóa thất bại!", {
                    position: "bottom-right",
                });
            }
        } catch (error: any) {
            toast.error(error.message, {
                position: "bottom-right",
            });
        }
    };

    return (
        <div>
            <DataTable
                actionRef={tableRef}
                headerTitle={"Danh sách người dùng"}
                rowKey="id"
                loading={isLoading}
                columns={columns}
                dataSource={data}
                request={async (params, sort, filter): Promise<any> => {
                    const query = buildQuery(params, sort, filter);
                    handleGetUsers(query)
                }}
                search={false}
                scroll={{ x: true }}
                pagination={
                    {
                        current: meta.current,
                        pageSize: meta.pageSize,
                        showSizeChanger: true,
                        total: meta.total,
                        showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} bản ghi</div>) }
                    }
                }
                rowSelection={false}
                toolBarRender={(_action, _rows): any => {
                    return (
                        <Button
                            icon={<PlusOutlined />}
                            type="primary"
                            onClick={() => setOpenModal(true)}
                        >
                            <span>
                                Thêm mới
                            </span>
                        </Button>
                    );
                }}
            />
            <ModalUser
                openModal={openModal}
                setOpenModal={setOpenModal}
                reloadTable={reloadTable}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />
        </div>
    );
};

export default User;
