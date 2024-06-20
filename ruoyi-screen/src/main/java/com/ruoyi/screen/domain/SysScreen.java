package com.ruoyi.screen.domain;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import com.ruoyi.common.annotation.Excel;
import com.ruoyi.common.core.domain.BaseEntity;

public class SysScreen extends BaseEntity {
    private static final long serialVersionUID = 1L;

    private Long screenId;

    @Excel(name = "任务名称")
    private String screenName;

    @Excel(name = "页面标题")
    private String screenTitle;

    @Excel(name = "页面数据 json")
    private String pageData;
    private String pageUrl;

    @Excel(name = "显示顺序")
    private Integer screenSort;

    @Excel(name = "状态", readConverterExp = "0=正常,1=停用")
    private String status;

    @Excel(name = "状态", readConverterExp = "0=未发布,1=已发布")
    private String isrelease;

    public void setScreenId(Long screenId) {
        this.screenId = screenId;
    }

    public Long getScreenId() {
        return screenId;
    }

    public void setScreenName(String screenName) {
        this.screenName = screenName;
    }

    public String getScreenName() {
        return screenName;
    }

    public void setScreenTitle(String screenTitle) {
        this.screenTitle = screenTitle;
    }

    public String getScreenTitle() {
        return screenTitle;
    }

    public void setPageData(String pageData) {
        this.pageData = pageData;
    }

    public String getPageData() {
        return pageData;
    }

    public void setScreenSort(Integer screenSort) {
        this.screenSort = screenSort;
    }

    public Integer getScreenSort() {
        return screenSort;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public void setIsrelease(String isrelease) {
        this.isrelease = isrelease;
    }

    public String getIsrelease() {
        return isrelease;
    }

    public String getPageUrl() {
        return pageUrl;
    }

    public void setPageUrl(String pageUrl) {
        this.pageUrl = pageUrl;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.MULTI_LINE_STYLE)
                .append("screenId", getScreenId())
                .append("screenName", getScreenName())
                .append("screenTitle", getScreenTitle())
                .append("pageData", getPageData())
                .append("pageUrl", getPageUrl())
                .append("screenSort", getScreenSort())
                .append("status", getStatus())
                .append("isrelease", getIsrelease())
                .append("createBy", getCreateBy())
                .append("createTime", getCreateTime())
                .append("updateBy", getUpdateBy())
                .append("updateTime", getUpdateTime())
                .append("remark", getRemark())
                .toString();
    }
}
