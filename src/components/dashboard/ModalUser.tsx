/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ModalForm, ProFormText } from "@ant-design/pro-components";
import { Button, Col, ConfigProvider, Form, Modal, Row, Upload, UploadProps, message, notification } from "antd";
import { isMobile } from 'react-device-detect';
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import enUS from 'antd/lib/locale/en_US';
import { LoadingOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { callCreateUser, callUpdateUserById, callUploadImage } from "../../config/api";
import { toast } from "react-toastify";
import ImgCrop from 'antd-img-crop';

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: any | null;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}

interface IUserImage {
    name: string;
    uid: string;
}

const ModalUser = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;

    const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
    const [dataImage, setDataImage] = useState<IUserImage[]>([]);
    const [songUrl, setSongUrl] = useState('')
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [form] = Form.useForm();

    useEffect(() => {
        if (dataInit?._id) {
            if (dataInit?.image) {
                setDataImage([
                    {
                        uid: uuidv4(),
                        name: `${import.meta.env.VITE_BE_URL}${dataInit.image}`
                    }
                ])
            }
        }

        return () => form.resetFields()
    }, [dataInit, form]);

    const submitData = async (valuesForm: any) => {
        const { fullName } = valuesForm;

        if (dataInit?._id) {
            //update

            const dataObj = {
                fullName,
                image: (dataImage[0]?.name as any)?.replaceAll(`${import.meta.env.VITE_BE_URL}`, ""),
                song: songUrl,
            }

            const res: any = await callUpdateUserById(dataInit._id, dataObj);
            if (res.isSuccess) {
                toast.success("Cập nhật người dùng thành công", {
                    position: "bottom-right",
                });
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        } else {
            //create
            const dataObj = {
                fullName,
                image: (dataImage[0]?.name as any)?.replaceAll(`${import.meta.env.VITE_BE_URL}`, ""),
                song: songUrl
            }
            const res: any = await callCreateUser(dataObj);
            if (res.isSuccess) {
                toast.success("Thêm mới người dùng thành công", {
                    position: "bottom-right",
                });
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        }
    }

    const handleReset = async () => {
        form.resetFields();
        setDataInit(null);
        setDataImage([])
        setOpenModal(false);
    }

    const handleRemoveFile = (_: any) => {
        setDataImage([])
    }

    const handlePreview = async (file: any) => {
        if (!file.originFileObj) {
            setPreviewImage(file.url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
            return;
        }
        getBase64(file.originFileObj, (url: string) => {
            setPreviewImage(url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
        });
    };

    const getBase64 = (img: any, callback: any) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const beforeUpload = (_: any) => {
        return true;
    };

    const handleChange = (info: any) => {
        if (info.file.status === 'uploading') {
            setLoadingUpload(true);
        }
        if (info.file.status === 'done') {
            setLoadingUpload(false);
        }
        if (info.file.status === 'error') {
            setLoadingUpload(false);
            message.error(info?.file?.error?.event?.message ?? "Đã có lỗi xảy ra khi upload file.")
        }
    };

    const handleUploadFileLogo = async ({ file, onSuccess, onError }: any) => {

        const res: any = await callUploadImage({ file, folder: 'images' });
        if (res?.isSuccess) {
            setDataImage([{
                name: `${import.meta.env.VITE_BE_URL}${res.fileUrl}`,
                uid: uuidv4()
            }])
            if (onSuccess) onSuccess('ok')
        } else {
            if (onError) {
                setDataImage([])
                const error = new Error(res.message);
                onError({ event: error });
            }
        }
    };

    const propsSong: UploadProps = {
        name: "file",
        action: `${import.meta.env.VITE_BE_URL}/users/upload-image?folder=mp3s`, // 👈 API backend thực tế của bạn
        method: "POST",
        data: {
            folder: "mp3s", // 👈 Tham số để backend biết lưu vào thư mục nào
        },
        headers: {
            // Nếu có token hoặc auth header thì thêm ở đây
            // Authorization: `Bearer ${token}`,
        },
        onChange(info) {
            if (info.file.status === "uploading") {
                console.log("Đang upload:", info.file.name);
            }
            if (info.file.status === "done") {
                message.success(`${info.file.name} upload thành công 🎵`);
                console.log("Server trả về:", info.file.response);
                setSongUrl(info.file.response.fileUrl)
            } else if (info.file.status === "error") {
                message.error(`${info.file.name} upload thất bại 😥`);
            }
        },
        accept: ".mp3", // 👈 Giới hạn chỉ chọn file MP3
        multiple: false, // 👈 Nếu muốn upload nhiều file thì đặt true
        showUploadList: true, // 👈 Hiển thị danh sách file đã chọn
    };

    return (
        <>
            <ModalForm
                title={<>{dataInit?._id ? "Cập nhật người dùng" : "Thêm mới người dùng"}</>}
                open={openModal}
                modalProps={{
                    onCancel: () => { handleReset() },
                    afterClose: () => handleReset(),
                    destroyOnClose: true,
                    width: isMobile ? "100%" : 900,
                    keyboard: false,
                    maskClosable: false,
                    okText: <>{dataInit?._id ? "Xác nhận" : "Thêm mới"}</>,
                    cancelText: "Hủy",
                    zIndex: 1
                }}
                scrollToFirstError={true}
                preserve={false}
                form={form}
                onFinish={submitData}
                initialValues={dataInit?._id ? dataInit : {}}
            >
                <Row gutter={16}>
                    <Col lg={24} md={24} sm={24} xs={24}>
                        <ProFormText
                            label={"Tên người dùng"}
                            name="fullName"
                            rules={[
                                { required: true, message: "Trường này là bắt buộc" },
                            ]}
                            placeholder={"Nhập thông tin"}
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <Form.Item
                            labelCol={{ span: 24 }}
                            label={"Ảnh đại diện"}
                            name="image"
                        >
                            <ConfigProvider locale={enUS}>
                                <ImgCrop rotationSlider>
                                    <Upload
                                        name="image"
                                        listType="picture-card"
                                        className="image-uploader"
                                        maxCount={1}
                                        multiple={false}
                                        customRequest={handleUploadFileLogo}
                                        beforeUpload={beforeUpload}
                                        onChange={handleChange}
                                        onRemove={(file) => handleRemoveFile(file)}
                                        onPreview={handlePreview}
                                        defaultFileList={
                                            dataInit?._id && dataInit.image ?
                                                [
                                                    {
                                                        uid: uuidv4(),
                                                        name: dataInit?.image ?? "",
                                                        status: 'done',
                                                        url: `${import.meta.env.VITE_BE_URL}${dataInit.image}`,
                                                    }
                                                ] : []
                                        }

                                    >
                                        <div>
                                            {loadingUpload ? <LoadingOutlined /> : <PlusOutlined />}
                                            <div style={{ marginTop: 8 }}>
                                                Tải ảnh lên
                                            </div>
                                        </div>
                                    </Upload>
                                </ImgCrop>
                            </ConfigProvider>
                        </Form.Item>

                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <Form.Item
                            labelCol={{ span: 24 }}
                            label={"Nhạc"}
                            name="song"
                        >
                            <ConfigProvider locale={enUS}>
                                <Upload {...propsSong}>
                                    <Button icon={<UploadOutlined />}>Click để tải</Button>
                                </Upload>
                            </ConfigProvider>
                        </Form.Item>

                    </Col>
                </Row>
            </ModalForm>
            <Modal
                open={previewOpen}
                title={previewTitle}
                footer={null}
                onCancel={() => setPreviewOpen(false)}
                style={{ zIndex: 50 }}
            >
                <img alt="img" style={{ width: '100%', objectFit: 'cover' }} width={500} height={500} src={previewImage} />
            </Modal>
        </>
    )
}

export default ModalUser;
